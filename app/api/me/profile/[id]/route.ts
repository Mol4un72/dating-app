import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('API PROFILE ID:', id)

    if (!id) {
      return NextResponse.json(
        { error: 'User id is required' },
        { status: 400 }
      )
    }

    console.log('Looking for User.id:', id)
    
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
        photos: {
          orderBy: {
            position: 'asc',
          },
        },
        interests: {
          include: {
            interest: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const profile = {
      id: user.id,
      name: user.name ?? 'Unknown',
      age: user.age,
      gender: user.gender,
      location: user.location ?? user.profile?.location ?? 'Unknown',
      bio: user.bio ?? user.profile?.bio ?? '',
      verified: user.verified,

      photo: user.photos[0]?.url ?? null,

      photos: user.photos.map((photo) => photo.url),

      interests: user.interests.map(
        (item) => item.interest.name
      ),
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('GET /api/profile/[id] error:', error)

    return NextResponse.json(
      { error: 'Failed to load profile' },
      { status: 500 }
    )
  }
}
