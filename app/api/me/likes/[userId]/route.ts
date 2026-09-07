import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await auth()

    console.log(
      '[DELETE LIKE] URL:',
      request.url,
    )

    const resolvedParams = await params

    console.log(
      '[DELETE LIKE] params:',
      resolvedParams,
    )

    console.log(
      '[DELETE LIKE] userId:',
      resolvedParams.userId,
    )

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const userId = resolvedParams.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      )
    }

    const like = await prisma.like.findFirst({
      where: {
        fromUserId: session.user.id,
        toUserId: userId,
      },
    })

    console.log(
      '[DELETE LIKE] found like:',
      like,
    )

    if (!like) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 },
      )
    }

    await prisma.like.delete({
      where: {
        id: like.id,
      },
    })

    console.log(
      '[DELETE LIKE] deleted:',
      like.id,
    )

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(
      '[DELETE LIKE] ERROR:',
      error,
    )

    return NextResponse.json(
      { error: 'Failed to remove like' },
      { status: 500 },
    )
  }
}