import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const settings = await prisma.userSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: {},
      create: {
        userId: session.user.id,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('SETTINGS GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await request.json()

    const data: {
      newMatches?: boolean
      newMessages?: boolean
      appUpdates?: boolean
      emailAlerts?: boolean
      profileVisibility?: string
      showOnlineStatus?: boolean
      shareData?: boolean
      interestedIn?: string
      ageRange?: string
      maxDistance?: number
      verifiedOnly?: boolean
      theme?: string
    } = {}

    if (body.newMatches !== undefined) {
      data.newMatches = Boolean(body.newMatches)
    }

    if (body.newMessages !== undefined) {
      data.newMessages = Boolean(body.newMessages)
    }

    if (body.appUpdates !== undefined) {
      data.appUpdates = Boolean(body.appUpdates)
    }

    if (body.emailAlerts !== undefined) {
      data.emailAlerts = Boolean(body.emailAlerts)
    }

    if (body.profileVisibility !== undefined) {
      data.profileVisibility = String(body.profileVisibility)
    }

    if (body.showOnlineStatus !== undefined) {
      data.showOnlineStatus = Boolean(body.showOnlineStatus)
    }

    if (body.shareData !== undefined) {
      data.shareData = Boolean(body.shareData)
    }

    if (body.interestedIn !== undefined) {
      data.interestedIn = String(body.interestedIn)
    }

    if (body.ageRange !== undefined) {
      data.ageRange = String(body.ageRange)
    }

    if (body.maxDistance !== undefined) {
      data.maxDistance = Number(body.maxDistance)
    }

    if (body.verifiedOnly !== undefined) {
      data.verifiedOnly = Boolean(body.verifiedOnly)
    }

    if (body.theme !== undefined) {
      data.theme = String(body.theme)
    }

    if (
      data.maxDistance !== undefined &&
      (!Number.isInteger(data.maxDistance) ||
        data.maxDistance < 0)
    ) {
      return NextResponse.json(
        { error: 'Invalid maxDistance' },
        { status: 400 },
      )
    }

    const settings = await prisma.userSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: data,
      create: {
        userId: session.user.id,
        ...data,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('SETTINGS UPDATE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 },
    )
  }
}