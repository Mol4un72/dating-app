'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

const LIKES_STORAGE_KEY = 'lumi_liked_users'

type LikesContextType = {
  likedUserIds: number[]
  toggleLike: (userId: number) => void
  isLiked: (userId: number) => boolean
  removeLike: (userId: number) => void
}

const LikesContext = createContext<LikesContextType | undefined>(undefined)

const readStoredLikes = () => {
  if (typeof window === 'undefined') return [] as number[]

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(LIKES_STORAGE_KEY) ?? '[]'
    )
    return Array.isArray(stored) ? stored.map(Number) : []
  } catch {
    return [] as number[]
  }
}

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likedUserIds, setLikedUserIds] = useState<number[]>(() =>
    readStoredLikes()
  )

  const persistLikes = (nextLikes: number[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(nextLikes))
    }
  }

  const toggleLike = (userId: number) => {
    setLikedUserIds((prev) => {
      const next = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]

      persistLikes(next)
      return next
    })
  }

  const isLiked = (userId: number) => {
    return likedUserIds.includes(userId)
  }

  const removeLike = (userId: number) => {
    setLikedUserIds((prev) => {
      const next = prev.filter((id) => id !== userId)
      persistLikes(next)
      return next
    })
  }

  return (
    <LikesContext.Provider
      value={{
        likedUserIds,
        toggleLike,
        isLiked,
        removeLike,
      }}
    >
      {children}
    </LikesContext.Provider>
  )
}

export function useLikes() {
  const context = useContext(LikesContext)

  if (!context) {
    throw new Error('useLikes must be used inside LikesProvider')
  }

  return context
}
