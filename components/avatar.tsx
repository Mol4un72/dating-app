import { cn } from '@/lib/utils'

const sizes = {
  sm: 'size-9',
  md: 'size-12',
  lg: 'size-16',
  xl: 'size-24',
}

export function Avatar({
  src,
  alt,
  size = 'md',
  online,
  ring,
  className,
}: {
  src: string
  alt: string
  size?: keyof typeof sizes
  online?: boolean
  ring?: boolean
  className?: string
}) {
  return (
    <span className={cn('relative inline-block shrink-0', className)}>
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          ring && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        )}
      />
      {online && (
        <span className="absolute bottom-0 right-0 block size-3 rounded-full border-2 border-background bg-emerald-500" />
      )}
    </span>
  )
}
