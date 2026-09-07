'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

const LIKES_STORAGE_KEY = 'lumi_liked_users'

type LikesContextType = {
  likedUserIds: string[]
  toggleLike: (userId: string) => Promise<void>
  addLike: (userId: string) => Promise<void>
  removeLike: (userId: string) => Promise<void>
  isLiked: (userId: string) => boolean
}

const LikesContext = createContext<LikesContextType | undefined>(
  undefined,
)

const readStoredLikes = (): string[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(LIKES_STORAGE_KEY) ?? '[]',
    )

    return Array.isArray(stored)
      ? stored.map(String)
      : []
  } catch {
    return []
  }
}

const persistLikes = (likes: string[]) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    LIKES_STORAGE_KEY,
    JSON.stringify(likes),
  )
}

export function LikesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [likedUserIds, setLikedUserIds] = useState<string[]>(
    readStoredLikes,
  )

  // Завантажуємо реальні лайки з БД
  useEffect(() => {
    async function loadLikes() {
      try {
        const response = await fetch('/api/me/likes', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) {
          console.error(
            '[LIKES] load likes failed:',
            response.status,
          )
          return
        }

        const data = await response.json()

        const ids = Array.isArray(data)
          ? data
              .map((user: { id?: unknown }) => user.id)
              .filter(
                (id: unknown): id is string =>
                  typeof id === 'string',
              )
          : []

        setLikedUserIds(ids)
        persistLikes(ids)
      } catch (error) {
        console.error(
          '[LIKES] load likes error:',
          error,
        )
      }
    }

    loadLikes()
  }, [])

  const addLike = async (userId: string) => {
    try {
      const response = await fetch('/api/me/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      })

      if (!response.ok) {
        const text = await response.text()

        console.error(
          '[LIKES] add like failed:',
          response.status,
          text,
        )

        throw new Error('Failed to add like')
      }

      setLikedUserIds((prev) => {
        if (prev.includes(userId)) {
          return prev
        }

        const next = [...prev, userId]
        persistLikes(next)

        return next
      })
    } catch (error) {
      console.error(
        '[LIKES] add like error:',
        error,
      )

      throw error
    }
  }


  const removeLike = async (userId: string) => {
    console.log('[LIKES] removeLike userId:', userId)

    if (!userId) {
      console.error('[LIKES] removeLike called without userId')
      return
    }

    const url = `/api/me/likes/${encodeURIComponent(userId)}`

    console.log('[LIKES] DELETE URL:', url)

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json().catch(() => null)

      console.log(
        '[LIKES] DELETE response:',
        response.status,
        data,
      )

      if (!response.ok && response.status !== 404) {
        throw new Error(
          data?.error ?? 'Failed to remove like',
        )
      }

      setLikedUserIds((prev) =>
        prev.filter((id) => id !== userId),
      )
    } catch (error) {
      console.error('[LIKES] remove like error:', error)
      throw error
    }
  }



  const toggleLike = async (userId: string) => {
    console.log(
      '[LIKES] toggleLike:',
      userId,
      'isLiked:',
      likedUserIds.includes(userId),
    )
  
    if (!userId) {
      console.error('[LIKES] toggleLike called without userId')
      return
    }
  
    if (likedUserIds.includes(userId)) {
      await removeLike(userId)
    } else {
      await addLike(userId)
    }
  }

  const isLiked = (userId: string) => {
    return likedUserIds.includes(userId)
  }

  return (
    <LikesContext.Provider
      value={{
        likedUserIds,
        toggleLike,
        addLike,
        removeLike,
        isLiked,
      }}
    >
      {children}
    </LikesContext.Provider>
  )
}

export function useLikes() {
  const context = useContext(LikesContext)

  if (!context) {
    throw new Error(
      'useLikes must be used inside LikesProvider',
    )
  }

  return context
}