'use client'

import { useEffect, useRef } from 'react'
import { type Person } from '@/lib/data'
import { ProfileCard } from '@/components/people/profile-card'

export function SwipeDeck({
  people,
  onOpenFilters,
}: {
  people: Person[]
  onOpenFilters?: () => void
}) {
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

    if (index !== -1) {
      containerRef.current.scrollTo({
        top: index * containerRef.current.clientHeight,
        behavior: 'instant',
      })
    } else if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'instant',
      })
    }
  }, [people])

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
        {people.map((person) => (
          <ProfileCard
            key={person.id}
            person={person}
            onOpenFilters={onOpenFilters}
            className="h-full shrink-0 snap-start snap-always"
          />
        )}
      </div>

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} />
    </div>
  )
}
