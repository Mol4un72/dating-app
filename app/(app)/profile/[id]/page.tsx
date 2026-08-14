'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Heart,
  MapPin,
  MessageCircle,
  Flag,
  Ban,
  Check,
  Info,
  X,
} from 'lucide-react'

import { people } from '@/lib/data'
import { Avatar } from '@/components/avatar'
import { Tag, VerifiedBadge } from '@/components/tag'
import { PillButton } from '@/components/pill-button'
import { Modal } from '@/components/modal'
import { cn } from '@/lib/utils'

const LIKES_STORAGE_KEY = 'lumi_liked_users'
const SETTINGS_STORAGE_KEY = 'lumi_settings'

const readStoredLikedUsers = () => {
  if (typeof window === 'undefined') return [] as number[]

  try {
    const stored = JSON.parse(window.localStorage.getItem(LIKES_STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored.map(Number) : []
  } catch {
    return [] as number[]
  }
}

const readStoredBlockedUsers = () => {
  if (typeof window === 'undefined') return [] as string[]

  try {
    const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}')
    return Array.isArray(stored.blockedUsers) ? stored.blockedUsers : []
  } catch {
    return [] as string[]
  }
}

export default function UserProfilePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const user = people.find((person) => person.id === Number(id))

  const [isLiked, setIsLiked] = useState<boolean>(() =>
    readStoredLikedUsers().includes(Number(user?.id ?? -1))
  )
  const [isBlocked, setIsBlocked] = useState<boolean>(() =>
    readStoredBlockedUsers().includes(user?.name ?? '')
  )
  const [confirmAction, setConfirmAction] = useState<'report' | 'block' | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)
  const toastTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current)
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null)
    }, 2500)
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl items-center justify-center px-4">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This user profile is not available.</p>
        </div>
      </div>
    )
  }

  const persistLikedUsers = (nextLikedUsers: number[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(nextLikedUsers))
    }
  }

  const persistBlockedUsers = (nextBlockedUsers: string[]) => {
    if (typeof window !== 'undefined') {
      const savedSettings = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}')
      const updatedSettings = {
        ...savedSettings,
        blockedUsers: nextBlockedUsers,
      }

      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings))
    }
  }

  const handleLike = () => {
    const next = !isLiked
    const currentLikedUsers = readStoredLikedUsers()
    const nextLikedUsers = next
      ? [...new Set([...currentLikedUsers, user.id])]
      : currentLikedUsers.filter((likedId) => likedId !== user.id)

    persistLikedUsers(nextLikedUsers)
    setIsLiked(next)
    showToast(next ? `You liked ${user.name}` : `You removed ${user.name} from likes`, next ? 'success' : 'info')
  }

  const handleMessage = () => {
    router.push(`/chat/${user.id}`)
    showToast(`Opening chat with ${user.name}`)
  }

  const handleReport = () => {
    setConfirmAction('report')
  }

  const handleBlock = () => {
    setConfirmAction('block')
  }

  const confirmCurrentAction = () => {
    if (confirmAction === 'report') {
      setConfirmAction(null)
      showToast(`Thanks, we'll review ${user.name}&apos;s profile`, 'info')
      return
    }

    const next = !isBlocked
    const currentBlockedUsers = readStoredBlockedUsers()
    const nextBlockedUsers = next
      ? [...new Set([...currentBlockedUsers, user.name])]
      : currentBlockedUsers.filter((blockedUser: string) => blockedUser !== user.name)

    persistBlockedUsers(nextBlockedUsers)
    setIsBlocked(next)
    setConfirmAction(null)
    showToast(next ? `${user.name} has been blocked` : `${user.name} is no longer blocked`, next ? 'success' : 'info')
  }

  return (
    <>
      <Modal
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null)
        }}
        title={confirmAction === 'block' ? 'Block this profile?' : 'Report this profile?'}
        description={
          confirmAction === 'block'
            ? `This will hide ${user.name} from your profile feed and add them to your block list.`
            : `We'll review ${user.name}'s profile to check if it violates our community guidelines.`
        }
      >
        <div className="flex gap-2">
          <PillButton block variant="outline" onClick={() => setConfirmAction(null)}>
            Cancel
          </PillButton>
          <PillButton block onClick={confirmCurrentAction}>
            {confirmAction === 'block' ? (isBlocked ? 'Unblock' : 'Block') : 'Report'}
          </PillButton>
        </div>
      </Modal>

      {toast && (
        <div
          className={cn(
            'fixed right-4 top-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg duration-300',
            toast.type === 'success' && 'bg-emerald-500 text-white',
            toast.type === 'error' && 'bg-destructive text-white',
            toast.type === 'info' && 'bg-slate-800 text-white'
          )}
        >
          {toast.type === 'success' ? <Check className="size-4 shrink-0" /> : <Info className="size-4 shrink-0" />}
          <span>{toast.message}</span>
          <button
            type="button"
            aria-label="Close notification"
            className="ml-1 rounded-full p-1 text-current/80 transition hover:text-current"
            onClick={() => setToast(null)}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <section className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
            <Avatar src={user.photo} alt={user.name} size="xl" ring />

            <div className="mt-4 flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}, {user.age}</h1>
              {user.verified && <VerifiedBadge />}
            </div>

            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {user.location}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">{user.distance}</p>

            <div className="mt-5 flex w-full gap-2">
              <PillButton
                block
                variant={isLiked ? 'secondary' : 'primary'}
                onClick={handleLike}
              >
                <Heart className={cn('size-4', isLiked && 'fill-current')} />
                {isLiked ? 'Liked' : 'Like'}
              </PillButton>

              <PillButton block variant="outline" onClick={handleMessage} disabled={isBlocked}>
                <MessageCircle className="size-4" />
                {isBlocked ? 'Blocked' : 'Message'}
              </PillButton>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-sm font-semibold">About</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{user.bio}</p>
            </div>

            <hr />

            <div className="my-5">
              <h2 className="text-sm font-semibold">Interests</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Tag key={interest} active>
                    {interest}
                  </Tag>
                ))}
              </div>
            </div>

            <hr />

            <div className="mt-5">
              <h2 className="text-sm font-semibold">Photos</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {user.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${user.name} photo ${index + 1}`}
                    className="aspect-[3/4] w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            </div>

            <hr className="my-5" />

            <div className="flex gap-2">
              <PillButton block variant="outline" onClick={handleReport}>
                <Flag className="size-4" />
                Report
              </PillButton>

              <PillButton
                block
                variant={isBlocked ? 'secondary' : 'outline'}
                onClick={handleBlock}
              >
                <Ban className="size-4" />
                {isBlocked ? 'Blocked' : 'Block'}
              </PillButton>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}