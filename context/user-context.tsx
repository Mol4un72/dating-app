'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { Me } from '@/types/me'

type UserContextValue = {
  user: Me | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(
  undefined,
)

export function UserProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<Me | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async () => {
    try {
      const response = await fetch('/api/me', {
        cache: 'no-store',
      })

      if (!response.ok) {
        setUser(null)
        return
      }

      const data: Me = await response.json()

      setUser(data)
    } catch (error) {
      console.error('Failed to load user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()

    const interval = setInterval(() => {
      loadUser()
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        refreshUser: loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useCurrentUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error(
      'useCurrentUser must be used inside UserProvider',
    )
  }

  return context
}