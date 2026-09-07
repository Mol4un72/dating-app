import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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
        { error: 'Conversation ID is required' },
        { status: 400 },
      )
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        participants: {
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
            createdAt: 'asc',
          },
          select: {
            id: true,
            senderId: true,
            text: true,
            imageUrl: true,
            reaction: true,
            createdAt: true,
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 },
      )
    }

    const otherParticipant = conversation.participants.find(
      (participant) => participant.userId !== session.user.id,
    )

    if (!otherParticipant) {
      return NextResponse.json(
        { error: 'Conversation participant not found' },
        { status: 404 },
      )
    }

    const person = otherParticipant.user

    return NextResponse.json({
      id: conversation.id,

      person: {
        id: person.id,
        name: person.name,
        age: person.age,
        location: person.location,
        verified: person.verified,
        photo: person.photos[0]?.url ?? '/placeholder.svg',
      },

      messages: conversation.messages.map((message) => ({
        id: message.id,
        fromMe: message.senderId === session.user.id,
        text: message.text ?? undefined,
        image: message.imageUrl ?? undefined,
        reaction: message.reaction ?? undefined,
        time: message.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('GET CONVERSATION ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to load conversation' },
      { status: 500 },
    )
  }
}