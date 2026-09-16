import { prisma } from '@/lib/prisma'
import type { NotificationType } from '@/lib/generated/prisma/client'

type CreateNotificationParams = {
  userId: string
  type: NotificationType
  title: string
  description: string
}

export async function createNotification({
  userId,
  type,
  title,
  description,
}: CreateNotificationParams) {
  const settings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
    select: {
      newMatches: true,
      newMessages: true,
      newLikes: true,
      appUpdates: true,
    },
  })

  if (type === 'match' && settings?.newMatches === false) {
    return null
  }

  if (type === 'message' && settings?.newMessages === false) {
    return null
  }

  if (type === 'like' && settings?.newLikes === false) {
    return null
  }

  if (type === 'appUpdate' && settings?.appUpdates === false) {
    return null
  }

  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      description,
    },
  })
}