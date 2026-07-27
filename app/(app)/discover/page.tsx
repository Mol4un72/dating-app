'use client'

import { useState } from 'react'
import { Bell, SlidersHorizontal, Search } from 'lucide-react'
import { AppTopBar } from '@/components/app-topbar'
import { SwipeDeck } from '@/components/people/swipe-deck'
import { FiltersModal } from '@/components/people/filters-modal'
import { people } from '@/lib/data'

export default function DiscoverPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <>
      <AppTopBar
        actions={
          <>
            <button
              type="button"
              aria-label="Search"
              className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
            </button>
          </>
        }
      />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 lg:py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Discover</h1>
            <p className="text-sm text-muted-foreground">People near you, ready to connect.</p>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </button>
        </div>

        <SwipeDeck people={people} />
      </div>

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} />
    </>
  )
}
