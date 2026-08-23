'use client'

import { useState, useRef } from 'react'
import { MapPin, BadgeCheck } from 'lucide-react'
import { type Person } from '@/lib/data'
import { useLikes } from '@/context/likes-context'
import { cn } from '@/lib/utils'

export function ProfileCard({
  person,
  className,
}: {
  person: Person
  className?: string
}) {
  const likeLock = useRef(false)
  const lastTap = useRef(0)
  const {
    isLiked,
    addLike: addLikedUser,
    removeLike: removeLikedUser,
  } = useLikes()
  const liked = isLiked(person.id)

  const [tapHearts, setTapHearts] = useState<
    {
      id: number
      x: number
      y: number
      rotate: number
    }[]
  >([])

  function addLike() {
    addLikedUser(person.id)
  }

  function removeLike(e: React.MouseEvent) {
    e.stopPropagation()
    removeLikedUser(person.id)
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
        'relative overflow-hidden border-border bg-card shadow-xl select-none touch-manipulation',
        className
      )}
      onDoubleClick={handleDoubleTap}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={person.photo}
        alt={person.name}
        className="size-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.21_0.02_15)]/85 via-[oklch(0.21_0.02_15)]/10 to-transparent" />
    
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

      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground/80">
        <MapPin className="size-3.5 text-primary" />
        {person.distance} km away
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white/80">
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

        <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
          <MapPin className="size-3.5" />
          {person.location}
        </p>

        <p className="mt-2 line-clamp-2 text-sm text-white/80">
          {person.bio}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {person.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-white/20 px-3 py-1 text-xs text-white/80"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

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