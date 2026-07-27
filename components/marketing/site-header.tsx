'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { PillButton } from '@/components/pill-button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label="Lumi home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#stories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Stories
          </a>
          <Link href="/discover" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Discover
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <PillButton href="/login" variant="ghost" size="sm">
            Log in
          </PillButton>
          <PillButton href="/register" size="sm" className="hidden sm:inline-flex">
            Join free
          </PillButton>
        </div>
      </div>
    </header>
  )
}
