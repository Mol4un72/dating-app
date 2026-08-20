'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, BadgeCheck } from 'lucide-react'
import { type Person, currentUser } from '@/lib/data'
import { MapPin, BadgeCheck, SlidersHorizontal } from 'lucide-react'
import { FiltersModal } from './filters-modal'
import { type Person } from '@/lib/data'
import { useLikes } from '@/context/likes-context'
import { cn } from '@/lib/utils'

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}

export function ProfileCard({
  person,
  className,
}: {
  person: Person
  className?: string
}) {
  const likeLock = useRef(false)
  const lastTap = useRef(0)

  const [liked, setLiked] = useState(false)

  const [tapHearts, setTapHearts] = useState<
    {
      id: number
      x: number
      y: number
      rotate: number
    }[]
  >([])

  useEffect(() => {
    setLiked(currentUser.likedUsers.includes(person.id))
  }, [person.id])

  function addLike() {
    if (!currentUser.likedUsers.includes(person.id)) {
      currentUser.likedUsers.push(person.id)
    }
    setLiked(true)
  }

  function removeLike(e: React.MouseEvent) {
    e.stopPropagation()
    const index = currentUser.likedUsers.indexOf(person.id)
    if (index !== -1) {
      currentUser.likedUsers.splice(index, 1)
    }
    setLiked(false)
  }

  const like = ({
    clientX,
    clientY,
    currentTarget,
  }: {
    clientX: number
    clientY: number
    currentTarget: HTMLElement
  }) => {
    if (likeLock.current) return

    likeLock.current = true

    setTimeout(() => {
      likeLock.current = false
    }, 300)

    addLike()

    const rect = currentTarget.getBoundingClientRect()
    const id = Date.now()

    const heart = {
      id,
      x: clientX - rect.left,
      y: clientY - rect.top,
      rotate: Math.floor(Math.random() * 25) - 12,
    }

    setTapHearts((prev) => [...prev, heart])

    setTimeout(() => {
      setTapHearts((prev) => prev.filter((h) => h.id !== id))
    }, 650)
  }

  const handleDoubleTap = (e: React.MouseEvent<HTMLElement>) => {
    like({
      clientX: e.clientX,
      clientY: e.clientY,
      currentTarget: e.currentTarget,
    })
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const now = Date.now()

    if (now - lastTap.current < 300) {
      const touch = e.changedTouches[0]

      like({
        clientX: touch.clientX,
        clientY: touch.clientY,
        currentTarget: e.currentTarget,
      })

      lastTap.current = 0
      return
    }

    lastTap.current = now
  }

  return (
    <article
      className={cn(
        'overflow-hidden border-border bg-card shadow-xl select-none touch-manipulation',
        className
      )}
    >
      <div
        className="relative h-full"
        onDoubleClick={handleDoubleTap}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={person.photo}
          alt={person.name}
          className="size-full object-cover"
        />

        {tapHearts.map((heart) => (
          <span
            key={heart.id}
            className="pointer-events-none absolute z-30 text-7xl"
            style={{
              left: heart.x,
              top: heart.y,
              transform: `translate(-50%, -50%) rotate(${heart.rotate}deg)`,
              animation: 'tapHeartFade 650ms ease forwards',
            }}
          >
            ❤️
          </span>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setFiltersOpen(true)
            }}
            className="absolute right-2 top-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-secondary"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </button>
        </div>

        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground">
          <MapPin className="size-3.5 text-primary" />
          {person.distance}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5 text-background">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">
              {person.name}, {person.age}
            </h2>

            {person.verified && <BadgeCheck className="size-5" />}

            {liked && (
              <button
                type="button"
                onClick={removeLike}
                className="grid size-8 place-items-center rounded-full bg-white/90 text-xl shadow-md transition-transform active:scale-90"
                aria-label="Remove like"
              >
                ❤️
              </button>
            )}
          </div>

          <p className="mt-1 flex items-center gap-1 text-sm text-background/80">
            <MapPin className="size-3.5" />
            {person.location}
          </p>

          <p className="mt-2 line-clamp-2 text-sm text-background/90">
            {person.bio}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {person.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-background/20 px-3 py-1 text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} />

      <style jsx>{`
        @keyframes tapHeartFade {
          0% {
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }
      `}</style>
    </article>
  )
}