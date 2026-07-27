import { Star } from 'lucide-react'
import { Avatar } from '@/components/avatar'

const testimonials = [
  {
    quote:
      'I’d almost given up on apps. Lumi felt different from the first day — calmer, kinder. I met my partner in two weeks.',
    name: 'Mia',
    detail: 'Matched in 2024',
    photo: '/people/mia.png',
  },
  {
    quote:
      'The conversations here actually go somewhere. No endless small talk, just real people being real.',
    name: 'Liam',
    detail: 'Brooklyn, NY',
    photo: '/people/liam.png',
  },
  {
    quote:
      'Beautifully designed and genuinely respectful of my time. It’s the first app that didn’t feel like a game.',
    name: 'Ava',
    detail: 'Matched in 2025',
    photo: '/people/ava.png',
  },
]

export function Testimonials() {
  return (
    <section id="stories" className="bg-accent/40 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Real people, real stories
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Thousands of connections start on Lumi every week.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm"
            >
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar src={t.photo} alt={t.name} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
