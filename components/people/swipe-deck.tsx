'use client'

import { useState } from 'react'
import { FiltersModal } from '@/components/people/filters-modal'
import { MapPin, BadgeCheck, SlidersHorizontal } from 'lucide-react'
import { type Person } from '@/lib/data'
import { cn } from '@/lib/utils'

export function SwipeDeck({ people }: { people: Person[] }) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="min-h-0 flex-1 snap-y snap-mandatory overflow-y-auto overscroll-contain touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {people.map((person) => (
          <ProfileCard
            key={person.id}
            person={person}
            className="h-full shrink-0 snap-start snap-always"
          />
        ))}
      </div>
    </div>
  )
}

function ProfileCard({
  person,
  className,
}: {
  person: Person
  className?: string
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <article
      className={cn(
        'overflow-hidden border-border bg-card shadow-xl',
        className,
      )}
    >

      <div className="relative h-full">
        <img
          src={person.photo || '/placeholder.svg'}
          alt={person.name}
          className="size-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" >

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex absolute right-2 top-2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </button>

        </div>

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
      
      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} />
      
    </article>
  )
}
