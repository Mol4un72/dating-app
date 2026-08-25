import Link from 'next/link'
import { Logo } from '@/components/logo'

export function AuthLayout({
  children,
  aside,
}: {
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="flex h-svh bg-background overflow-hidden">
      {/* Form column */}
      <div className="flex w-full flex-col px-5 py-6 lg:w-[52%] lg:px-16">
        <Link href="/" aria-label="Lumi home" className="inline-flex">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      {/* Visual column (desktop) */}
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        <img
          src="/hero-couple.png"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-foreground/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          {aside ?? (
            <blockquote className="max-w-md text-balance text-2xl font-semibold leading-snug text-white">
              “We matched on a Tuesday and haven’t stopped talking since.”
            </blockquote>
          )}
        </div>
      </div>
    </div>
  )
}
