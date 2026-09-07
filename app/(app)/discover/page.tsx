'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppTopBar } from '@/components/app-topbar'
import { SwipeDeck } from '@/components/people/swipe-deck'
import { NotificationsButton } from '@/components/notifications-button'
import { FiltersModal } from '@/components/people/filters-modal'
import { PillButton } from '@/components/pill-button'
import { useFilters } from '@/context/filters-context'
import { SlidersHorizontal, UserX, RotateCcw } from 'lucide-react'
import type { Person } from '@/types/person'

export default function DiscoverPage() {
  const { filters, resetFilters } = useFilters()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [people, setPeople] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    const loadPeople = async () => {
      setIsLoading(true)
      setError(false)

      try {
        const response = await fetch('/api/discover', {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Discover API: ${response.status}`)
        }

        const data = await response.json()

        if (!active) return

        setPeople(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('DISCOVER ERROR:', error)

        if (!active) return

        setPeople([])
        setError(true)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadPeople()

    return () => {
      active = false
    }
  }, [])

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      // Gender
      if (
        filters.interestedIn !== 'Everyone' &&
        person.gender
      ) {
        if (filters.interestedIn === 'Women') {
          if (person.gender !== 'Female') {
            return false
          }
        }

        if (filters.interestedIn === 'Men') {
          if (person.gender !== 'Male') {
            return false
          }
        }
      }
    
      // Age
      if (person.age !== null && person.age !== undefined) {
        if (filters.ageRange === '18 – 25') {
          if (person.age < 18 || person.age > 25) {
            return false
          }
        }
      
        if (filters.ageRange === '25 – 35') {
          if (person.age < 25 || person.age > 35) {
            return false
          }
        }
      
        if (filters.ageRange === '35 – 45') {
          if (person.age < 35 || person.age > 45) {
            return false
          }
        }
      
        if (filters.ageRange === '45+') {
          if (person.age < 45) {
            return false
          }
        }
      }
    
      // Distance
      if (filters.distance !== '51') {
        const maxDistance = Number(filters.distance)
      
        if (
          !Number.isNaN(maxDistance) &&
          person.distance > maxDistance
        ) {
          return false
        }
      }
    
      return true
    })
  }, [people, filters])

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
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold">
              Failed to load profiles
            </h2>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              Try again
            </button>
          </div>
        ) : filteredPeople.length > 0 ? (
          <SwipeDeck people={filteredPeople} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <UserX className="size-8" />
            </div>

            <h2 className="text-xl font-bold text-foreground">
              No profiles found
            </h2>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We couldn&apos;t find anyone matching your current filters.
            </p>

            <div className="mt-6 flex gap-3">
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

      <FiltersModal
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
      />
    </>
  )
}