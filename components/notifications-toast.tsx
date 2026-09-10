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

const TOAST_ID = 'new-notifications'

export default function NotificationsToast() {
  const initialized = useRef(false)
  const knownIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const response = await fetch('/api/me/notifications', {
          cache: 'no-store',
        })

        if (!response.ok) {
          console.error(
            'Notifications API error:',
            response.status,
          )
          return
        }

        const notifications: Notification[] =
          await response.json()

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

        const count = newNotifications.length

        // Закриваємо попередній toast
        toast.dismiss(TOAST_ID)

        // Показуємо ТІЛЬКИ ОДИН
        if (count === 1) {
          const notification = newNotifications[0]

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