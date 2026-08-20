import { cn } from '@/lib/utils'

type NotFoundProps = {
  title: string
  description: string
  action?: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function NotFound({
  title,
  description,
  action,
  className,
  icon,
}: NotFoundProps) {
  return (
    <div
      className={cn(
        'flex min-h-full w-full flex-1 flex-col items-center justify-center px-4 py-10 text-center',
        className,
      )}
    >
      {icon}
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
