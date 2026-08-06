'use client'

import { useState } from 'react'
import { AppTopBar } from '@/components/app-topbar'
import { LikedCard } from '@/components/people/liked-card'
import { people, currentUser } from '@/lib/data'

export default function LikesPage() {
  const [likedPeople, setLikedPeople] = useState(
    people.filter((person) =>
      currentUser.likedUsers.includes(person.id)
    )
  )

  const handleDislike = (id: number) => {

    setLikedPeople((prev) =>
      prev.filter((person) => person.id !== id)
    )

    currentUser.likedUsers =
      currentUser.likedUsers.filter(
        (likedId) => likedId !== id
      )
  }
  
  return (
    <>
      <AppTopBar title="Likes" />
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
