import { Compass, Sparkles, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: Compass,
    title: 'Discover people',
    body: 'Browse thoughtfully curated profiles near you, filtered by what actually matters to you.',
  },
  {
    icon: Sparkles,
    title: 'Match',
    body: 'Our matching gently surfaces the people you’re most likely to click with — quality over quantity.',
  },
  {
    icon: MessageCircle,
    title: 'Chat',
    body: 'Start real conversations with prompts, reactions, and a calm, clutter-free inbox.',
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
          Dating, made simple
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Everything you need to meet someone great, and nothing you don’t.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-primary">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
