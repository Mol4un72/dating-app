'use client'

import { useEffect, useRef } from 'react'
import { type Person } from '@/lib/data'
import { ProfileCard } from '@/components/people/profile-card'

export function SwipeDeck({ people }: { people: Person[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedId = localStorage.getItem('currentProfile')

    if (!savedId || !containerRef.current) return

    const index = people.findIndex(
      (person) => person.id === Number(savedId)
    )

    if (index !== -1) {
      containerRef.current.scrollTo({
        top: index * containerRef.current.clientHeight,
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

    const person = people[index]

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
            className="h-full shrink-0 snap-start snap-always"
          />
        ))}
      </div>
    </div>
  )
}