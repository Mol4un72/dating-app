import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const likes = await prisma.like.findMany({
      where: {
        fromUserId: session.user.id,
      },
      include: {
        toUser: {
          include: {
            photos: {
              orderBy: {
                position: 'asc',
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const data = likes.map((like) => ({
      id: like.toUser.id,
      name: like.toUser.name,
      age: like.toUser.age,
      gender: like.toUser.gender,
      location: like.toUser.location,
      bio: like.toUser.bio,
      verified: like.toUser.verified,
      photo: like.toUser.photos[0]?.url ?? null,
      likedAt: like.createdAt.toISOString(),
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error('LIKES GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to load likes' },
      { status: 500 },
    )
  }
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

    const userId =
      typeof body.userId === 'string'
        ? body.userId
        : ''

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      )
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot like yourself' },
        { status: 400 },
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
      },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    // Check whether this like already exists.
    const existingLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: session.user.id,
          toUserId: userId,
        },
      },
    })

    // Create the like only if it does not already exist.
    const like =
      existingLike ??
      (await prisma.like.create({
        data: {
          fromUserId: session.user.id,
          toUserId: userId,
        },
      }))

    // Check whether the other user has already liked us.
    const reverseLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: userId,
          toUserId: session.user.id,
        },
      },
    })

    // No mutual like → regular like.
    if (!reverseLike) {
      // Only notify when the like was actually created now.
      if (!existingLike) {
        const sender = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
          select: {
            name: true,
          },
        })

        await createNotification({
          userId,
          type: 'like',
          title: 'New like',
          description: `${
            sender?.name ?? 'Someone'
          } liked your profile`,
        })
      }

      return NextResponse.json(
        {
          success: true,
          liked: true,
          matched: false,
          likeId: like.id,
        },
        { status: 201 },
      )
    }

    // Normalize user IDs so the same pair always has
    // the same user1/user2 order.
    const [user1Id, user2Id] = [
      session.user.id,
      userId,
    ].sort()

    // Check whether the match already exists.
    const existingMatch = await prisma.match.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
    })

    // Create match only if it does not exist.
    const match =
      existingMatch ??
      (await prisma.match.create({
        data: {
          user1Id,
          user2Id,
        },
      }))

    // Find existing conversation for this match.
    let conversation =
      await prisma.conversation.findUnique({
        where: {
          matchId: match.id,
        },
      })

    // Create conversation only if it does not exist.
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          matchId: match.id,
          participants: {
            create: [
              {
                userId: user1Id,
              },
              {
                userId: user2Id,
              },
            ],
          },
        },
      })
    }

    // Send match notifications only when the match
    // was actually created now.
    if (!existingMatch) {
      const sender = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          name: true,
        },
      })

      const senderName =
        sender?.name ?? 'Someone'

      await Promise.all([
        createNotification({
          userId: session.user.id,
          type: 'match',
          title: 'It’s a match!',
          description: `You matched with ${
            targetUser.name ?? 'someone'
          }`,
        }),

        createNotification({
          userId,
          type: 'match',
          title: 'It’s a match!',
          description: `You matched with ${
            senderName
          }`,
        }),
      ])
    }

    return NextResponse.json(
      {
        success: true,
        liked: true,
        matched: true,
        likeId: like.id,
        matchId: match.id,
        conversationId: conversation.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('LIKES POST ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to like user' },
      { status: 500 },
    )
  }
}
