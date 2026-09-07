import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()

    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only images are allowed' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Maximum file size is 5MB' },
        { status: 400 }
      )
    }

    const photosCount = await prisma.profilePhoto.count({
      where: {
        userId: session.user.id,
      },
    })

    if (photosCount >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 photos allowed' },
        { status: 400 }
      )
    }

    const extension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg'

    const fileName = `${crypto.randomUUID()}.${extension}`

    const uploadDirectory = path.join(
      process.cwd(),
      'public',
      'uploads'
    )

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    })

    const filePath = path.join(
      uploadDirectory,
      fileName
    )

    const bytes = await file.arrayBuffer()

    await fs.writeFile(
      filePath,
      Buffer.from(bytes)
    )

    const photo = await prisma.profilePhoto.create({
      data: {
        userId: session.user.id,
        url: `/uploads/${fileName}`,
        position: photosCount,
      },
    })

    return NextResponse.json(
      {
        id: photo.id,
        url: photo.url,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('PHOTO UPLOAD ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const photoId = String(body.id ?? '')

    if (!photoId) {
      return NextResponse.json(
        { error: 'Photo id is required' },
        { status: 400 }
      )
    }

    const photo = await prisma.profilePhoto.findFirst({
      where: {
        id: photoId,
        userId: session.user.id,
      },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    await prisma.profilePhoto.delete({
      where: {
        id: photo.id,
      },
    })

    /*
     * Try to remove local file.
     * Database deletion still succeeds if
     * the physical file is already missing.
     */

    if (photo.url.startsWith('/uploads/')) {
      const filePath = path.join(
        process.cwd(),
        'public',
        photo.url
      )

      try {
        await fs.unlink(filePath)
      } catch {
        // File may already be deleted.
      }
    }

    /*
     * Re-number remaining photos.
     */

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