import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    console.log('[GET /api/me/conversations] session user:', session?.user?.id)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const userId = session.user.id

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },

      include: {
        participants: {
          where: {
            userId: {
              not: userId,
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                age: true,
                location: true,
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
              },
            },
          },
        },

        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            senderId: true,
            text: true,
            imageUrl: true,
            createdAt: true,
          },
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    })

    console.log(
      '[GET /api/me/conversations] conversations:',
      conversations.length,
    )

    const result = conversations
      .map((conversation) => {
        const participant = conversation.participants[0]

        if (!participant) {
          return null
        }

        const lastMessage = conversation.messages[0]
        const person = participant.user

        return {
          id: conversation.id,
          personId: person.id,
          name: person.name ?? 'User',
          photo: person.photos[0]?.url ?? '/placeholder.svg',
          online: false,

          lastMessage:
            lastMessage?.text ??
            (lastMessage?.imageUrl ? '📷 Photo' : 'No messages yet'),

          time: lastMessage
            ? formatMessageTime(lastMessage.createdAt)
            : formatMessageTime(conversation.updatedAt),

          unread: 0,
        }
      })
      .filter(
        (
          conversation,
        ): conversation is NonNullable<typeof conversation> =>
          conversation !== null,
      )

    return NextResponse.json(result)
  } catch (error) {
    console.error(
      '[GET /api/me/conversations] ERROR:',
      error,
    )

    return NextResponse.json(
      {
        error: 'Failed to load conversations',
      },
      {
        status: 500,
      },
    )
  }
}

function formatMessageTime(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return 'Now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await request.json()

    const otherUserId =
      typeof body.userId === 'string'
        ? body.userId.trim()
        : ''

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      )
    }

    if (otherUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot create conversation with yourself' },
        { status: 400 },
      )
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id: otherUserId,
      },
      select: {
        id: true,
      },
    })

    if (!otherUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    const existingConversation =
      await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: {
                  userId: session.user.id,
                },
              },
            },
            {
              participants: {
                some: {
                  userId: otherUserId,
                },
              },
            },
          ],
        },
        select: {
          id: true,
        },
      })

    if (existingConversation) {
      return NextResponse.json({
        id: existingConversation.id,
      })
    }

    const conversation =
      await prisma.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId: session.user.id,
              },
              {
                userId: otherUserId,
              },
            ],
          },
        },
        select: {
          id: true,
        },
      })

    return NextResponse.json(
      {
        id: conversation.id,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error(
      '[POST /api/conversations] ERROR:',
      error,
    )

    return NextResponse.json(
      {
        error: 'Failed to create conversation',
      },
      {
        status: 500,
      },
    )
  }
}