import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    if (!Array.isArray(body.interests)) {
      return NextResponse.json(
        { error: 'interests must be an array' },
        { status: 400 }
      )
    }

    const interests = body.interests
      .map((interest: unknown) => String(interest).trim())
      .filter(Boolean)

    if (interests.length === 0) {
      return NextResponse.json(
        { error: 'At least one interest is required' },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.profileInterest.deleteMany({
        where: {
          userId: session.user.id,
        },
      })

      for (const name of interests) {
        const interest = await tx.interest.upsert({
          where: {
            name,
          },
          update: {},
          create: {
            name,
          },
        })

        await tx.profileInterest.create({
          data: {
            userId: session.user.id,
            interestId: interest.id,
          },
        })
      }

      return tx.profileInterest.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          interest: true,
        },
      })
    })

    return NextResponse.json({
      interests: result.map((item) => item.interest.name),
    })
  } catch (error) {
    console.error('INTERESTS UPDATE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to update interests' },
      { status: 500 }
    )
  }
}