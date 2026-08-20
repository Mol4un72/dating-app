import { BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Tag({
  children,
  active,
  className,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  className?: string
  onClick?: () => void
}) {
  const classes = cn(
    'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
    active
      ? 'bg-primary text-primary-foreground'
      : 'bg-secondary text-secondary-foreground',
    className,
  )

  if (!onClick) {
    return <span className={classes}>{children}</span>
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        classes,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      {children}
    </button>
  )
}

export function VerifiedBadge({
  withLabel = false,
  className,
}: {
  withLabel?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full text-primary',
        withLabel && 'bg-accent px-2.5 py-1 text-xs font-semibold',
        className,
      )}
    >
      <BadgeCheck className="size-4" />
      {withLabel && <span>Verified</span>}
    </span>
  )
}
