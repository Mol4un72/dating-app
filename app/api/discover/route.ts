import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    )
  }

  const userId = session.user.id

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
    },
    select: {
      id: true,
      name: true,
      age: true,
      gender: true,
      location: true,
      bio: true,
      verified: true,
      photos: {
        orderBy: {
          position: 'asc',
        },
        take: 1,
        select: {
          url: true,
        },
      },
      interests: {
        include: {
          interest: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json(
    users.map((user) => ({
      id: user.id,
      name: user.name ?? 'User',
      age: user.age,
      gender: user.gender,
      location: user.location ?? '',
      bio: user.bio ?? '',
      verified: user.verified,
      photo: user.photos[0]?.url ?? '/placeholder.svg',
      distance: 0,
      interests: user.interests.map(
        (item) => item.interest.name,
      ),
    })),
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}