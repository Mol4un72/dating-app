import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const pillButton = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:size-[1.1em]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
        outline: 'border border-border bg-card text-foreground hover:bg-secondary',
        ghost: 'text-foreground hover:bg-secondary',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-[0.95rem]',
        lg: 'h-14 px-7 text-base',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
)

type Props = VariantProps<typeof pillButton> & {
  className?: string
  href?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function PillButton({ className, variant, size, block, href, ...props }: Props) {
  const classes = cn(pillButton({ variant, size, block }), className)
  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    )
  }
  return <button className={classes} {...props} />
}
