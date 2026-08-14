'use client'

import { useState } from 'react'
import { AppTopBar } from '@/components/app-topbar'
import { LikedCard } from '@/components/people/liked-card'
import { NotificationsButton } from '@/components/notifications-button'
import { people } from '@/lib/data'

const getSavedLikedUsers = () => {
  if (typeof window === 'undefined') return [] as number[]

  try {
    const stored = JSON.parse(window.localStorage.getItem('lumi_liked_users') ?? '[]')
    return Array.isArray(stored) ? stored.map(Number) : []
  } catch {
    return [] as number[]
  }
}

export default function LikesPage() {
  const [likedPeople, setLikedPeople] = useState(() =>
    people.filter((person) => getSavedLikedUsers().includes(person.id))
  )

  const handleDislike = (id: number) => {
    const nextLikedUsers = getSavedLikedUsers().filter((likedId) => likedId !== id)

    setLikedPeople((prev) =>
      prev.filter((person) => person.id !== id)
    )

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lumi_liked_users', JSON.stringify(nextLikedUsers))
    }
  }

  return (
    <>
      <AppTopBar title="Likes" actions={<NotificationsButton />}/>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {likedPeople.length} people you liked
            </h1>
            <p className="text-sm text-muted-foreground">Click on like to remove from liked</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {likedPeople.map((person) => (
            <LikedCard
              key={person.id}
              person={person}
              onDislike={() => handleDislike(person.id)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
