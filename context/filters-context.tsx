'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

export type Filters = {
  interestedIn: string
  ageRange: string
  distance: string
}

export type FiltersContextType = {
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
  resetFilters: () => void
}

export const defaultFilters: Filters = {
  interestedIn: 'Everyone',
  ageRange: '25 – 35',
  distance: '20',
}

const FILTERS_STORAGE_KEY = 'lumi_filters'

const readStoredFilters = (): Filters => {
  if (typeof window === 'undefined') return defaultFilters

  try {
    const stored = window.localStorage.getItem(FILTERS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        interestedIn: parsed.interestedIn ?? defaultFilters.interestedIn,
        ageRange: parsed.ageRange ?? defaultFilters.ageRange,
        distance: parsed.distance ?? defaultFilters.distance,
      }
    }
  } catch {
    // fallback
  }

  return defaultFilters
}

const FiltersContext = createContext<
  FiltersContextType | undefined
>(undefined)

export function FiltersProvider({
  children,
}: {
  children: ReactNode
}) {
  const [filters, setFiltersState] = useState<Filters>(() => readStoredFilters())

  const setFilters: Dispatch<SetStateAction<Filters>> = (value) => {
    setFiltersState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
      }
      return next
    })
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FiltersContext)

  if (!context) {
    throw new Error(
      'useFilters must be used inside FiltersProvider'
    )
  }

  return context
}