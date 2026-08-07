'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

type Filters = {
  interestedIn: string
  ageRange: string
  distance: string
}

type FiltersContextType = {
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
}

const defaultFilters: Filters = {
  interestedIn: 'Everyone',
  ageRange: '25 – 35',
  distance: '20',
}

const FiltersContext = createContext<
  FiltersContextType | undefined
>(undefined)


export function FiltersProvider({
  children,
}: {
  children: ReactNode
}) {
  const [filters, setFilters] = useState(defaultFilters)

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilters,
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