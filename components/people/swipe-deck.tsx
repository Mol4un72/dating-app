'use client'

import { useState } from 'react'
import { MapPin, Star, X, Heart, BadgeCheck, RotateCcw } from 'lucide-react'
import { type Person } from '@/lib/data'
import { cn } from '@/lib/utils'

type Decision = 'like' | 'pass' | 'super'

export function SwipeDeck({ people }: { people: Person[] }) {
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<Decision | null>(null)
  const [history, setHistory] = useState<number[]>([])

  const current = people[index % people.length]
  const next = people[(index + 1) % people.length]

  function decide(decision: Decision) {
    if (leaving) return
    setLeaving(decision)
    setHistory((h) => [...h, index])
    window.setTimeout(() => {
      setIndex((i) => i + 1)
      setLeaving(null)
    }, 320)
  }

  function rewind() {
    if (history.length === 0 || leaving) return
    setHistory((h) => h.slice(0, -1))
    setIndex((i) => Math.max(0, i - 1))
  }

  const leaveClass =
    leaving === 'like'
      ? 'translate-x-[120%] rotate-12 opacity-0'
      : leaving === 'pass'
        ? '-translate-x-[120%] -rotate-12 opacity-0'
        : leaving === 'super'
          ? '-translate-y-[120%] opacity-0'
          : ''

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-[3/4.2] w-full max-w-sm">
        {/* Next card underneath */}
        <ProfileCard person={next} className="absolute inset-0 scale-[0.94] opacity-70" />
        {/* Current card */}
        <ProfileCard
          person={current}
          className={cn(
            'absolute inset-0 transition-all duration-300 ease-out',
            leaveClass,
          )}
          badge={leaving}
        />
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-4">
        <ActionButton label="Rewind" onClick={rewind} className="size-12 text-amber-500" disabled={history.length === 0}>
          <RotateCcw className="size-5" />
        </ActionButton>
        <ActionButton label="Pass" onClick={() => decide('pass')} className="size-16 text-foreground">
          <X className="size-7" />
        </ActionButton>
        <ActionButton
          label="Super like"
          onClick={() => decide('super')}
          className="size-14 text-sky-500"
        >
          <Star className="size-6 fill-current" />
        </ActionButton>
        <ActionButton
          label="Like"
          onClick={() => decide('like')}
          className="size-16 bg-primary text-primary-foreground hover:bg-primary/90"
          solid
        >
          <Heart className="size-7 fill-current" />
        </ActionButton>
      </div>
    </div>
  )
}

function ActionButton({
  children,
  label,
  onClick,
  className,
  solid,
  disabled,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  className?: string
  solid?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'grid place-items-center rounded-full shadow-md transition-all active:scale-90 disabled:opacity-40 disabled:active:scale-100',
        !solid && 'border border-border bg-card hover:bg-secondary',
        className,
      )}
    >
      {children}
    </button>
  )
}

function ProfileCard({
  person,
  className,
  badge,
}: {
  person: Person
  className?: string
  badge?: Decision | null
}) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl',
        className,
      )}
    >
      <div className="relative h-full">
        <img
          src={person.photo || '/placeholder.svg'}
          alt={person.name}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />

        {/* Decision stamps */}
        {badge === 'like' && <Stamp className="right-5 top-6 rotate-12 border-primary text-primary">LIKE</Stamp>}
        {badge === 'pass' && <Stamp className="left-5 top-6 -rotate-12 border-foreground text-foreground">NOPE</Stamp>}
        {badge === 'super' && (
          <Stamp className="left-1/2 top-6 -translate-x-1/2 border-sky-500 text-sky-500">SUPER</Stamp>
        )}

        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
          <MapPin className="size-3.5 text-primary" />
          {person.distance}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5 text-background">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">
              {person.name}, {person.age}
            </h2>
            {person.verified && <BadgeCheck className="size-5 text-background" />}
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-background/80">
            <MapPin className="size-3.5" /> {person.location}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-background/90">{person.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {person.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-background/20 px-3 py-1 text-xs font-medium text-background backdrop-blur"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function Stamp({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'absolute rounded-xl border-4 px-3 py-1 text-2xl font-black tracking-wider',
        className,
      )}
    >
      {children}
    </span>
  )
}
