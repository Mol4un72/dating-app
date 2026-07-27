import { cn } from '@/lib/utils'

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {hint}
      </div>
      {children}
    </div>
  )
}

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-xl border border-border bg-card px-4 text-[0.95rem] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 text-[0.95rem] text-foreground shadow-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
