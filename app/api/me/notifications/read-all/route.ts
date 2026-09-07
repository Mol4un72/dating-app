import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        unread: true,
      },
      data: {
        unread: false,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('NOTIFICATIONS READ ALL ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 },
    )
  }
}