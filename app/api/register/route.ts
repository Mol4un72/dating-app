import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

function calculateAge(birthday: string) {
  const birthDate = new Date(birthday)

  if (Number.isNaN(birthDate.getTime())) {
    return null
  }

  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()

  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email = String(body.email ?? '')
      .trim()
      .toLowerCase()

    const password = String(body.password ?? '')
    const name = String(body.name ?? '').trim()
    const birthday = String(body.birthday ?? '')
    const gender = String(body.gender ?? '').trim()
    const location = String(body.location ?? '').trim()
    const bio = String(body.bio ?? '').trim()
    const interestsRaw = body.interests

    if (!email || !password || !name || !birthday || !gender || !location || !bio) {
      return NextResponse.json(
        {
          error: 'All required fields (basic info, location, bio) must be provided',
        },
        { status: 400 },
      )
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          error: 'Name must be at least 2 characters',
        },
        { status: 400 },
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: 'Password must be at least 8 characters',
        },
        { status: 400 },
      )
    }

    const age = calculateAge(birthday)

    if (age === null || age < 18 || age > 100) {
      return NextResponse.json(
        {
          error: 'You must be at least 18 years old',
        },
        { status: 400 },
      )
    }

    if (gender !== 'Woman' && gender !== 'Man') {
      return NextResponse.json(
        {
          error: 'Please select a valid gender',
        },
        { status: 400 },
      )
    }

    if (location.length < 4) {
      return NextResponse.json(
        {
          error: 'Location must be at least 4 characters',
        },
        { status: 400 },
      )
    }

    if (bio.length < 20) {
      return NextResponse.json(
        {
          error: 'About me must be at least 20 characters',
        },
        { status: 400 },
      )
    }

    const interests = Array.isArray(interestsRaw)
      ? interestsRaw
          .map((i: unknown) => String(i).trim())
          .filter(Boolean)
      : []

    if (interests.length < 3) {
      return NextResponse.json(
        {
          error: 'Please select at least 3 interests',
        },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'User with this email already exists',
        },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          age,
          gender,
          location,
          bio,

          profile: {
            create: {
              location,
              bio,
            },
          },

          settings: {
            create: {
              interestedIn: gender === 'Woman' ? 'Men' : 'Women',
            },
          },
        },
      })

      for (const interestName of interests) {
        const interest = await tx.interest.upsert({
          where: {
            name: interestName,
          },
          update: {},
          create: {
            name: interestName,
          },
        })

        await tx.profileInterest.create({
          data: {
            userId: newUser.id,
            interestId: interest.id,
          },
        })
      }

      return newUser
    })

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Registration error:', error)

    return NextResponse.json(
      {
        error: 'Something went wrong during registration',
      },
      { status: 500 },
    )
  }
}