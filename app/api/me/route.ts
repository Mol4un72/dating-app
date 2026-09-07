import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function getCurrentUser() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
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

      notifications: {
        orderBy: {
          createdAt: 'desc',
        },
      },

      settings: true,
    },
  })
}

function formatUser(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) {
  return {
    id: user.id,
    email: user.email,

    name: user.name,
    age: user.age,
    gender: user.gender,
    location: user.location,
    bio: user.bio,
    verified: user.verified,

    phone: user.phone,
    language: user.language,

    photos: user.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
    })),

    interests: user.interests.map(
      (item) => item.interest.name
    ),

    notifications: user.notifications,

    settings: user.settings
      ? {
          id: user.settings.id,
          interestedIn: user.settings.interestedIn,
          ageRange: user.settings.ageRange,
          maxDistance: user.settings.maxDistance,
          verifiedOnly: user.settings.verifiedOnly,
          theme: user.settings.theme,
        }
      : null,
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(formatUser(user))
  } catch (error) {
    console.error('GET PROFILE ERROR:', error)

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

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

    /*
     * -------------------------
     * USER DATA
     * -------------------------
     */

    const userData: {
      name?: string
      age?: number
      gender?: string
      location?: string
      bio?: string
      phone?: string
      language?: string
    } = {}

    if (body.name !== undefined) {
      userData.name = String(body.name).trim()
    }

    if (body.location !== undefined) {
      userData.location = String(body.location).trim()
    }

    if (body.bio !== undefined) {
      userData.bio = String(body.bio).trim()
    }

    if (body.age !== undefined) {
      const age = Number(body.age)

      if (!Number.isNaN(age)) {
        userData.age = age
      }
    }

    if (body.gender !== undefined) {
      userData.gender = String(body.gender)
    }

    if (body.phone !== undefined) {
      userData.phone = String(body.phone).trim()
    }

    if (body.language !== undefined) {
      userData.language = String(body.language)
    }

    if (Object.keys(userData).length > 0) {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: userData,
      })
    }

    /*
     * -------------------------
     * INTERESTS
     * -------------------------
     */

    if (body.interests !== undefined) {
      const interests = Array.isArray(body.interests)
        ? body.interests
        : []

      await prisma.profileInterest.deleteMany({
        where: {
          userId: session.user.id,
        },
      })

      for (const interestName of interests) {
        const name = String(interestName).trim()

        if (!name) continue

        const interest = await prisma.interest.upsert({
          where: {
            name,
          },
          update: {},
          create: {
            name,
          },
        })

        await prisma.profileInterest.create({
          data: {
            userId: session.user.id,
            interestId: interest.id,
          },
        })
      }
    }

    /*
     * -------------------------
     * PREFERENCES
     * -------------------------
     */

    if (body.filters !== undefined) {
      const filters = body.filters ?? {}

      const interestedIn = String(
        filters.interestedIn ?? 'Everyone'
      )

      const ageRange = String(
        filters.ageRange ?? '18 – 25'
      )

      const maxDistance = Number(
        filters.distance ?? 51
      )

      await prisma.userSettings.upsert({
        where: {
          userId: session.user.id,
        },

        update: {
          interestedIn,
          ageRange,
          maxDistance,
        },

        create: {
          userId: session.user.id,
          interestedIn,
          ageRange,
          maxDistance,
        },
      })
    }

    /*
     * -------------------------
     * RETURN UPDATED PROFILE
     * -------------------------
     */

    const updatedUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },

      include: {
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

        notifications: {
          orderBy: {
            createdAt: 'desc',
          },
        },

        settings: true,
      },
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      formatUser(updatedUser)
    )
  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error)

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}