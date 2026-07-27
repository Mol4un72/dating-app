import { Heart, Star } from 'lucide-react'
import { PillButton } from '@/components/pill-button'
import { Avatar } from '@/components/avatar'

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-8 pt-12 lg:px-8 lg:pb-20 lg:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-primary">
            <Star className="size-3.5 fill-primary" />
            Over 2 million real connections made
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find meaningful connections
          </h1>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
            Lumi is a calmer way to date. Thoughtful profiles, real conversations,
            and matches that actually feel right — no noise, no games.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <PillButton href="/register" size="lg">
              Start matching
            </PillButton>
            <PillButton href="/discover" size="lg" variant="outline">
              Explore people
            </PillButton>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-3">
              {['/people/sophie.png', '/people/james.png', '/people/mia.png', '/people/liam.png'].map(
                (src) => (
                  <Avatar key={src} src={src} alt="Member" size="sm" className="ring-2 ring-background rounded-full" />
                ),
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">4.9/5</span> from 120k+ members
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="relative flex justify-center">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-accent/60 blur-2xl" aria-hidden />
          <div className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
            <div className="relative">
              <img
                src="/hero-couple.png"
                alt="A happy couple who met on Lumi"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
                It’s a match!
              </div>
              <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Heart className="size-5 fill-current" />
              </span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-base font-semibold text-foreground">Sophie & Daniel</p>
                <p className="text-sm text-muted-foreground">Matched 3 weeks ago</p>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                98% match
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
