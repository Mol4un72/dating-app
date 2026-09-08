import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    console.log('PHOTO UPLOAD: start')

    const session = await auth()
    console.log('PHOTO UPLOAD: auth', Boolean(session?.user?.id))

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    console.log('PHOTO UPLOAD: file', {
      isFile: file instanceof File,
      type: file instanceof File ? file.type : null,
      size: file instanceof File ? file.size : null,
    })

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

    console.log('PHOTO UPLOAD: photos count', photosCount)

    if (photosCount >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 photos allowed' },
        { status: 400 }
      )
    }

    console.log('PHOTO UPLOAD: before blob')

    const blob = await put(
      `profiles/${session.user.id}/${crypto.randomUUID()}-${file.name}`,
      file,
      {
        access: 'public',
      }
    )

    console.log('PHOTO UPLOAD: blob success', blob.url)

    const photo = await prisma.profilePhoto.create({
      data: {
        userId: session.user.id,
        url: blob.url,
        position: photosCount,
      },
    })

    console.log('PHOTO UPLOAD: database success', photo.id)

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