'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { type Person } from '@/lib/data'
import { ProfileCard } from '@/components/people/profile-card'
import { FiltersModal } from '@/components/people/filters-modal'
import { PillButton } from '@/components/pill-button'
import { useFilters } from '@/context/filters-context'

function isInAgeRange(age: number, ageRange: string) {
  switch (ageRange) {
    case '18 – 25':
      return age >= 18 && age <= 25
    case '25 – 35':
      return age >= 25 && age <= 35
    case '35 – 45':
      return age >= 35 && age <= 45
    case '45+':
      return age >= 45
    default:
      return true
  }
}

function isWithinDistance(person: Person, maxDistance: string) {
  if (maxDistance === '51') return true

  const distance = Number.parseFloat(person.distance)
  const limit = Number(maxDistance)

  return Number.isFinite(distance) && Number.isFinite(limit) && distance <= limit
}

export function SwipeDeck({ people }: { people: Person[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { filters } = useFilters()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filteredPeople = useMemo(() => {
    const sex = filters.interestedIn === 'Men'
      ? 'male'
      : filters.interestedIn === 'Women'
        ? 'female'
        : undefined

    return people.filter((person) => (
      (!sex || person.sex === sex) &&
      isInAgeRange(person.age, filters.ageRange) &&
      isWithinDistance(person, filters.distance)
    ))
  }, [filters, people])

  useEffect(() => {
    const savedId = localStorage.getItem('currentProfile')

    if (!savedId || !containerRef.current) return

    const index = filteredPeople.findIndex(
      (person) => person.id === Number(savedId)
    )

    containerRef.current.scrollTo({
      top: Math.max(index, 0) * containerRef.current.clientHeight,
      behavior: 'instant',
    })
  }, [filteredPeople])

  const handleScroll = () => {
    if (!containerRef.current) return

    const index = Math.round(
      containerRef.current.scrollTop /
      containerRef.current.clientHeight
    )

    const person = filteredPeople[index]

    if (person) {
      localStorage.setItem(
        'currentProfile',
        String(person.id)
      )
    }
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="
          min-h-0
          flex-1
          snap-y
          snap-mandatory
          overflow-y-auto
          overscroll-contain
          touch-pan-y
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {filteredPeople.length > 0 ? (
          filteredPeople.map((person) => (
            <ProfileCard
              key={person.id}
              person={person}
              onFiltersOpen={() => setFiltersOpen(true)}
              className="h-full shrink-0 snap-start snap-always"
            />
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              No people match these filters
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try broadening your age range, distance, or who you&apos;re interested in.
            </p>
            <PillButton className="mt-6" onClick={() => setFiltersOpen(true)}>
              Adjust filters
            </PillButton>
          </div>
        )}
      </div>

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} />
    </div>
  )
}
