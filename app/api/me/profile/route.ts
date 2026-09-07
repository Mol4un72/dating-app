import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const data: {
      name?: string
      age?: number | null
      gender?: string | null
      location?: string
      bio?: string
      phone?: string | null
      language?: string
    } = {}

    if (body.name !== undefined) {
      data.name = String(body.name).trim()
    }

    if (body.age !== undefined) {
      data.age =
        body.age === null || body.age === ''
          ? null
          : Number(body.age)
    }

    if (body.gender !== undefined) {
      data.gender =
        body.gender === null || body.gender === ''
          ? null
          : String(body.gender)
    }

    if (body.location !== undefined) {
      data.location = String(body.location).trim()
    }

    if (body.bio !== undefined) {
      data.bio = String(body.bio).trim()
    }

    if (body.phone !== undefined) {
      data.phone =
        body.phone === null || body.phone === ''
          ? null
          : String(body.phone).trim()
    }

    if (body.language !== undefined) {
      data.language = String(body.language).trim()
    }

    if (data.age !== undefined) {
      if (
        data.age !== null &&
        (!Number.isInteger(data.age) || data.age < 18)
      ) {
        return NextResponse.json(
          { error: 'Age must be at least 18' },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data,
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      location: user.location,
      bio: user.bio,
      phone: user.phone,
      language: user.language,
    })
  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}