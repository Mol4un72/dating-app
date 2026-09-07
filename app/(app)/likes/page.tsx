'use client'

import { useEffect, useState } from 'react'
import { AppTopBar } from '@/components/app-topbar'
import { LikedCard } from '@/components/people/liked-card'
import { NotificationsButton } from '@/components/notifications-button'
import type { Person } from "@/types/person"
import { useLikes } from '@/context/likes-context'

export default function LikesPage() {
  const [likedPeople, setLikedPeople] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { removeLike } = useLikes()

  useEffect(() => {
    async function loadLikes() {
      try {
        const response = await fetch('/api/me/likes')

        if (!response.ok) {
          throw new Error('Failed to load likes')
        }

        const data = await response.json()
        setLikedPeople(data)
      } catch (error) {
        console.error('Failed to load likes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLikes()
  }, [])

  const handleDislike = async (id: string) => {
    try {
      const response = await fetch(`/api/me/likes/${id}`, {
        method: 'DELETE',
      })
    
      if (!response.ok) {
        throw new Error('Failed to remove like')
      }
    
      // Оновлюємо Context
      removeLike(id)
    
      // Прибираємо картку зі сторінки Likes
      setLikedPeople((prev) =>
        prev.filter((person) => person.id !== id)
      )
    } catch (error) {
      console.error('Failed to remove like:', error)
    }
  }

  if (isLoading) {
    return (
      <>
        <AppTopBar
          title="Likes"
          actions={<NotificationsButton />}
        />

        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </>
    )
  }

  return (
    <>
      <AppTopBar
        title="Likes"
        actions={<NotificationsButton />}
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {likedPeople.length} people you liked
          </h1>

          <p className="text-sm text-muted-foreground">
            Click on like to remove from liked
          </p>
        </div>

        {likedPeople.length === 0 ? (
          <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <span className="text-2xl">♥</span>
            </div>

            <h2 className="text-xl font-bold">
              No likes yet
            </h2>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Start exploring profiles and save the ones you want
              to revisit later.
            </p>
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