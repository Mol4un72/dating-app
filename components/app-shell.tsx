'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Compass,
  Heart,
  MessageCircle,
  User,
} from 'lucide-react'

import { Logo } from '@/components/logo'
import { Avatar } from '@/components/avatar'
import { currentUser } from '@/lib/data'
import { cn } from '@/lib/utils'

const nav = [
  {
    href: '/discover',
    label: 'Discover',
    icon: Compass,
  },
  {
    href: '/likes',
    label: 'Likes',
    icon: Heart,
  },
  {
    href: '/chat',
    label: 'Chat',
    icon: MessageCircle,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
]

export function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(href + '/')

  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    if (!window.visualViewport) return

    const handleResize = () => {
      const heightDiff =
        window.innerHeight -
        window.visualViewport!.height

      setKeyboardOpen(heightDiff > 150)
    }

    handleResize()

    window.visualViewport.addEventListener(
      'resize',
      handleResize,
    )

    return () => {
      window.visualViewport?.removeEventListener(
        'resize',
        handleResize,
      )
    }
  }, [])

  return (
    <div
      className="mx-auto flex min-h-svh w-full bg-background"
      style={{
        ['--nav-h' as string]: keyboardOpen
          ? '0px'
          : 'calc(4rem + env(safe-area-inset-bottom))',
      }}
    >
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo />
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-[0.95rem] font-medium transition-colors',
                  active
                    ? 'bg-accent text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Link
          href="/profile"
          className="mt-auto flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-secondary"
        >
          <Avatar
            src={currentUser.photo}
            alt={currentUser.name}
            size="sm"
            online
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {currentUser.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              View profile
            </p>
          </div>
        </Link>
      </aside>

      {/* Main content */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col pb-[var(--nav-h,4rem)] transition-[padding] duration-200 lg:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 backdrop-blur-lg transition-transform duration-200 lg:hidden',
          keyboardOpen && 'translate-y-full',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2 py-2">
          {nav.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[0.7rem] font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'size-6',
                    active && 'fill-primary/15',
                  )}
                />

                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}