import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { id: conversationId } = await params

    const participant =
      await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: session.user.id,
          },
        },
      })

    if (!participant) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 },
      )
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const data = messages.map((message) => ({
      id: message.id,
      fromMe:
        message.senderId === session.user.id,
      text: message.text ?? undefined,
      image: message.imageUrl ?? undefined,
      time: message.createdAt.toISOString(),
      reaction: message.reaction ?? undefined,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error(
      'GET /api/conversations/[id]/messages:',
      error,
    )

    return NextResponse.json(
      { error: 'Failed to load messages' },
      { status: 500 },
    )
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { id: conversationId } = await params

    const participant =
      await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: session.user.id,
          },
        },
      })

    if (!participant) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 },
      )
    }

    const body = await request.json()

    const text =
      typeof body.text === 'string'
        ? body.text.trim()
        : null

    const imageUrl =
      typeof body.imageUrl === 'string'
        ? body.imageUrl
        : null

    if (!text && !imageUrl) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 },
      )
    }

    const otherParticipant =
      await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId: {
            not: session.user.id,
          },
        },
        select: {
          userId: true,
        },
      })

    if (!otherParticipant) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 400 },
      )
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        text: text || null,
        imageUrl: imageUrl || null,
      },
    })

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    })

    const sender = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
      },
    })

    await createNotification({
      userId: otherParticipant.userId,
      type: 'message',
      title: 'New message',
      description: `${
        sender?.name ?? 'Someone'
      } sent you a message`,
    })

    return NextResponse.json(
      {
        id: message.id,
        fromMe: true,
        text: message.text ?? undefined,
        image: message.imageUrl ?? undefined,
        time: message.createdAt.toISOString(),
        reaction: message.reaction ?? undefined,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(
      'POST /api/conversations/[id]/messages:',
      error,
    )

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    )
  }
}