import Link from 'next/link'
import { Logo } from '@/components/logo'
import { PillButton } from '@/components/pill-button'

const columns = [
  { title: 'Product', links: ['Discover', 'How it works', 'Safety', 'Premium'] },
  { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
  { title: 'Support', links: ['Help center', 'Community', 'Contact', 'Guidelines'] },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground lg:px-12 lg:py-16">
          <h2 className="mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight lg:text-4xl">
            Your person is out there
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-primary-foreground/80">
            Join Lumi today and start meeting people who get you.
          </p>
          <PillButton
            href="/register"
            size="lg"
            className="mt-7 bg-card text-foreground hover:bg-card/90"
          >
            Start matching
          </PillButton>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A calmer, more thoughtful way to meet someone real.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Lumi. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
