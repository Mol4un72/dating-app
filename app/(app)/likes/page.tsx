'use client'

import { useEffect, useState } from 'react'
import { AppTopBar } from '@/components/app-topbar'
import { LikedCard } from '@/components/people/liked-card'
import { NotificationsButton } from '@/components/notifications-button'
import { people } from '@/lib/data'
import { useLikes } from '@/context/likes-context'

export default function LikesPage() {
  const { likedUserIds, toggleLike } = useLikes()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [])

  const likedPeople = people.filter((person) => likedUserIds.includes(person.id))

  const handleDislike = (id: number) => {
    toggleLike(id)
  }

  if (isLoading) {
    return (
      <>
        <AppTopBar title="Likes" actions={<NotificationsButton />} />
        <div className="mx-auto flex min-h-[50vh] w-full max-w-4xl items-center justify-center px-4 py-10">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading likes...
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AppTopBar title="Likes" actions={<NotificationsButton />} />
      <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {likedPeople.length} people you liked
            </h1>
            <p className="text-sm text-muted-foreground">Click on like to remove from liked</p>
          </div>
        </div>

        {likedPeople.length === 0 ? (
          <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <span className="text-2xl">♥</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">No likes yet</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Start exploring profiles and save the ones you want to revisit later.
            </p>
            <a href="/discover" className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Explore profiles
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {likedPeople.map((person) => (
              <LikedCard
                key={person.id}
                person={person}
                onDislike={() => handleDislike(person.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
