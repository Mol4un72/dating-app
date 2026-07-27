import { cn } from '@/lib/utils'

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d="M12 21s-6.716-4.297-9.193-8.02C1.06 10.36 1.86 6.9 4.79 5.86c1.98-.7 4.02.13 5.21 1.83C11.19 5.99 13.23 5.16 15.21 5.86c2.93 1.04 3.73 4.5 1.98 7.12C18.716 16.703 12 21 12 21z" />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-foreground">Lumi</span>
      )}
    </span>
  )
}
