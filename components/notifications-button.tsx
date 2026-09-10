'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  X,
} from 'lucide-react'
import type { NotificationType } from '@/types/notifications'
import { useCurrentUser } from '@/context/user-context'

const notificationTypes: Record<
  NotificationType,
  {
    icon: React.ElementType
    style: string
  }
> = {
  like: {
    icon: Heart,
    style: 'bg-pink-100 text-pink-600',
  },
  match: {
    icon: UserPlus,
    style: 'bg-primary/10 text-primary',
  },
  message: {
    icon: MessageCircle,
    style: 'bg-blue-100 text-blue-600',
  },
}

function formatNotificationTime(date: string) {
  return new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
  }).format(
    Math.round(
      (new Date(date).getTime() - Date.now()) / 60000
    ),
    'minute'
  )
}

export function NotificationsButton() {
  const { user } = useCurrentUser()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(
    user?.notifications ?? []
  )

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNotifications(user?.notifications ?? [])
  }, [user?.notifications])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const hasUnread = notifications.some(
    (item) => item.unread
  )

  async function toggleNotifications() {
    const nextOpen = !open
    setOpen(nextOpen)

    if (!nextOpen) return

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      })),
    )

    await fetch('/api/me/notifications/read-all', {
      method: 'POST',
    })
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={toggleNotifications}
        className="relative grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
      >
        <Bell className="size-5" />

        {hasUnread && (
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        )}
      </button>

      {open && (
        <div className="fixed left-2 right-2 top-20 z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-96">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
            <div>
              <h2 className="text-sm font-bold text-foreground sm:text-base">
                Notifications
              </h2>

              <p className="text-xs text-muted-foreground">
                Recent activity
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-full hover:bg-secondary"
            >
              <X className="size-4" />
            </button>
          </div>

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 p-4 sm:p-6">
              <p className="text-sm text-muted-foreground sm:text-base mt-2">
                No notifications yet
              </p>
            </div>
          )}

          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-2 sm:max-h-96 ">
            {notifications.map((item) => {
              const config =
                notificationTypes[item.type as keyof typeof notificationTypes]

              const Icon = config.icon

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`
                    flex w-full gap-3 rounded-xl p-3 text-left transition hover:bg-secondary mt-2
                    ${item.unread ? 'bg-secondary/50' : ''}
                  `}
                >
                  <div
                    className={`
                      grid size-10 shrink-0 place-items-center rounded-full
                      ${config.style}
                    `}
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        {item.title}
                      </p>

                      {item.unread && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatNotificationTime(item.createdAt)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}