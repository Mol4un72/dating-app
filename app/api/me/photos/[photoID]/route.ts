import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      photoID: string
    }>
  }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { photoID } = await context.params

    const photo = await prisma.profilePhoto.findFirst({
      where: {
        id: photoID,
        userId: session.user.id,
      },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    const count = await prisma.profilePhoto.count({
      where: {
        userId: session.user.id,
      },
    })

    if (count <= 1) {
      return NextResponse.json(
        {
          error: 'You must keep at least one photo',
        },
        { status: 400 }
      )
    }

    await del(photo.url)

    await prisma.profilePhoto.delete({
      where: {
        id: photo.id,
      },
    })

    const remainingPhotos =
      await prisma.profilePhoto.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          position: 'asc',
        },
      })

    await prisma.$transaction(
      remainingPhotos.map((photo, index) =>
        prisma.profilePhoto.update({
          where: {
            id: photo.id,
          },
          data: {
            position: index,
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('PHOTO DELETE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    )
  }
}