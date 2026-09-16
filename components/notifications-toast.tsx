'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

type Notification = {
  id: string
  type: string
  title: string
  description: string
  unread: boolean
  createdAt: string
}

type NotificationSettings = {
  newLikes: boolean
  newMatches: boolean
  newMessages: boolean
}

const TOAST_ID = 'new-notifications'

export default function NotificationsToast() {
  const initialized = useRef(false)
  const knownIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const [notificationsResponse, settingsResponse] = await Promise.all([
          fetch('/api/me/notifications', { cache: 'no-store' }),
          fetch('/api/me/settings', { cache: 'no-store' }),
        ])

        if (!notificationsResponse.ok || !settingsResponse.ok) {
          console.error(
            'Notifications settings API error:',
            notificationsResponse.status,
          )
          return
        }

        const notifications: Notification[] =
          await notificationsResponse.json()
        const settings: NotificationSettings =
          await settingsResponse.json()

        // Перше завантаження — просто запам'ятовуємо існуючі
        if (!initialized.current) {
          notifications.forEach((notification) => {
            knownIds.current.add(notification.id)
          })

          initialized.current = true
          return
        }

        // Шукаємо нові
        const newNotifications = notifications.filter(
          (notification) =>
            !knownIds.current.has(notification.id),
        )

        if (newNotifications.length === 0) {
          return
        }

        // Запам'ятовуємо ВСІ нові notifications
        newNotifications.forEach((notification) => {
          knownIds.current.add(notification.id)
        })

        const enabledNotifications = newNotifications.filter(
          (notification) =>
            (notification.type === 'like' && settings.newLikes) ||
            (notification.type === 'match' && settings.newMatches) ||
            (notification.type === 'message' && settings.newMessages),
        )

        if (enabledNotifications.length === 0) {
          return
        }

        const count = enabledNotifications.length

        // Закриваємо попередній toast
        toast.dismiss(TOAST_ID)

        // Показуємо ТІЛЬКИ ОДИН
        if (count === 1) {
          const notification = enabledNotifications[0]

          toast(notification.title, {
            id: TOAST_ID,
            description: notification.description,
            duration: 5000,
          })
        } else {
          toast(`${count} new notifications`, {
            id: TOAST_ID,
            description: 'You have new notifications',
            duration: 5000,
          })
        }
      } catch (error) {
        console.error(
          'NOTIFICATION POLLING ERROR:',
          error,
        )
      }
    }

    checkNotifications()

    const interval = setInterval(
      checkNotifications,
      5000,
    )

    return () => {
      clearInterval(interval)
    }
  }, [])

  return null
}