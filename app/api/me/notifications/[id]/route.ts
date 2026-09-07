import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Notification id is required' },
        { status: 400 },
      )
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 },
      )
    }

    const updatedNotification =
      await prisma.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          unread: false,
        },
      })

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error('NOTIFICATION UPDATE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 },
    )
  }
}