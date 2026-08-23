'use client'

import { useState, useMemo } from 'react'
import { AppTopBar } from '@/components/app-topbar'
import { SwipeDeck } from '@/components/people/swipe-deck'
import { NotificationsButton } from '@/components/notifications-button'
import { FiltersModal } from '@/components/people/filters-modal'
import { PillButton } from '@/components/pill-button'
import { people } from '@/lib/data'
import { useFilters } from '@/context/filters-context'
import { SlidersHorizontal, UserX, RotateCcw } from 'lucide-react'

export default function DiscoverPage() {
  const { filters, resetFilters } = useFilters()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      // 1. Gender filter
      if (filters.interestedIn === 'Men' && person.gender !== 'Men') return false
      if (filters.interestedIn === 'Women' && person.gender !== 'Women') return false

      // 2. Age range filter
      if (filters.ageRange === '18 – 25') {
        if (person.age < 18 || person.age > 25) return false
      } else if (filters.ageRange === '25 – 35') {
        if (person.age < 25 || person.age > 35) return false
      } else if (filters.ageRange === '35 – 45') {
        if (person.age < 35 || person.age > 45) return false
      } else if (filters.ageRange === '45+') {
        if (person.age < 45) return false
      }

      // 3. Distance filter
      if (filters.distance && filters.distance !== '51') {
        const maxDist = parseInt(filters.distance, 10)
        const personDist = person.distance
        if (!isNaN(maxDist) && !isNaN(personDist) && personDist > maxDist) {
          return false
        }
      }

      return true
    })
  }, [filters])

  return (
    <>
      <AppTopBar
        actions={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:bg-secondary"
            >
              <SlidersHorizontal className="size-3.5" />
              Filters
            </button>
            <NotificationsButton />
          </div>
        }
      />

      <div className="mx-auto flex h-[calc(100svh-8rem)] min-h-0 w-full max-w-2xl flex-col lg:h-[calc(100svh-4rem)]">
        {filteredPeople.length > 0 ? (
          <SwipeDeck
            people={filteredPeople}
            onOpenFilters={() => setFiltersOpen(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <UserX className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">No profiles found</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We couldn&apos;t find anyone matching your current filters. Try adjusting your preferences or expanding distance.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <PillButton onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal className="size-4" />
                Adjust filters
              </PillButton>
              <PillButton variant="outline" onClick={resetFilters}>
                <RotateCcw className="size-4" />
                Reset filters
              </PillButton>
            </div>
          </div>
        )}
      </div>

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} />
    </>
  )
}
