'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Avatar } from '@/components/avatar'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/context/user-context'

export function AppTopBar({
  title,
  actions,
  className,
}: {
  title?: string
  actions?: React.ReactNode
  className?: string
}) {
  const { user } = useCurrentUser()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-lg lg:px-8',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="lg:hidden">
          <Logo showWordmark={!title} />
        </span>

        {title && (
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">

        {actions}

        <Link
          href="/profile"
          className="lg:hidden"
        >
          <Avatar
            src={user?.photos?.[0]?.url}
            alt={user?.name ?? 'name'}
            size="sm"
          />
        </Link>
      </div>
    </header>
  )
}