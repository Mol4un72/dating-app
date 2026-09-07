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

import { Avatar } from '@/components/avatar'
import { Tag, VerifiedBadge } from '@/components/tag'
import { PillButton } from '@/components/pill-button'
import { Modal } from '@/components/modal'
import { useLikes } from '@/context/likes-context'
import { cn } from '@/lib/utils'

const SETTINGS_STORAGE_KEY = 'lumi_settings'

type UserProfile = {
  id: string
  name: string
  age: number | null
  gender: string | null
  location: string
  bio: string
  verified: boolean
  photo: string | null
  photos: string[]
  interests: string[]
}

const readStoredBlockedUsers = (): string[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)

    if (!raw) {
      return []
    }

    const stored: unknown = JSON.parse(raw)

    if (
      typeof stored !== 'object' ||
      stored === null ||
      !('blockedUsers' in stored)
    ) {
      return []
    }

    const blockedUsers = (stored as { blockedUsers?: unknown }).blockedUsers

    return Array.isArray(blockedUsers)
      ? blockedUsers.filter((value): value is string => typeof value === 'string')
      : []
  } catch {
    return []
  }
}

export default function UserProfilePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const { isLiked, toggleLike, removeLike } = useLikes()

  const id = params.id

  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [isBlocked, setIsBlocked] = useState(false)

  const [confirmAction, setConfirmAction] = useState<
    'report' | 'block' | null
  >(null)

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  const toastTimeoutRef = useRef<number | null>(null)

  /*
   * LOAD REAL USER
   */
  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    async function loadUser() {
      try {
        console.log('[PROFILE PAGE] loading user:', id)

        const response = await fetch(
          `/api/me/profile/${encodeURIComponent(id)}`,
          {
            method: 'GET',
            cache: 'no-store',
          },
        )

        console.log(
          '[PROFILE PAGE] response status:',
          response.status,
        )

        if (!response.ok) {
          const errorText = await response.text()

          console.error('[PROFILE PAGE] API status:', response.status)
          console.error('[PROFILE PAGE] API response:', errorText)

          setUser(null)
          return
        }

        const data = await response.json()

        console.log(
          '[PROFILE PAGE] received user:',
          data,
        )

        setUser(data)

        const blockedUsers = readStoredBlockedUsers()

        setIsBlocked(
          blockedUsers.includes(data.id) ||
            blockedUsers.includes(data.name),
        )
      } catch (error) {
        console.error(
          '[PROFILE PAGE] failed to load user:',
          error,
        )

        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [id])

  /*
   * CLEANUP TOAST
   */
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  /*
   * TOAST
   */
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
  ) => {
    setToast({
      message,
      type,
    })

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current)
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null)
    }, 2500)
  }

  /*
   * BLOCKED USERS
   */
  const persistBlockedUsers = (
    nextBlockedUsers: string[],
  ) => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const savedSettings = JSON.parse(
        window.localStorage.getItem(
          SETTINGS_STORAGE_KEY,
        ) ?? '{}',
      )

      const updatedSettings = {
        ...savedSettings,
        blockedUsers: nextBlockedUsers,
      }

      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(updatedSettings),
      )
    } catch (error) {
      console.error(
        'Failed to save blocked users:',
        error,
      )
    }
  }

  /*
   * LIKE
   */
  const handleLike = async () => {
    if (!user) return
    
    const wasLiked = isLiked(user.id)
    
    try {
      await toggleLike(user.id)
    
      showToast(
        wasLiked
          ? `You removed ${user.name} from likes`
          : `You liked ${user.name}`,
        wasLiked ? 'info' : 'success',
      )
    } catch (error) {
      console.error('[PROFILE] like action failed:', error)
    
      showToast(
        'Failed to update like',
        'error',
      )
    }
  }

  /*
   * MESSAGE
   */
  const [isOpeningChat, setIsOpeningChat] = useState(false)

  const handleMessage = async () => {
    if (!user || isBlocked || isOpeningChat) return

    try {
      setIsOpeningChat(true)

      const response = await fetch(
        '/api/conversations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error ?? 'Failed to open conversation',
        )
      }

      if (!data?.id) {
        throw new Error(
          'Conversation ID was not returned',
        )
      }

      router.push(
        `/chat/${encodeURIComponent(data.id)}`,
      )
    } catch (error) {
      console.error(
        '[PROFILE PAGE] failed to open chat:',
        error,
      )

      showToast(
        'Failed to open chat',
        'error',
      )
    } finally {
      setIsOpeningChat(false)
    }
  }

  /*
   * REPORT
   */
  const handleReport = () => {
    setConfirmAction('report')
  }

  /*
   * BLOCK
   */
  const handleBlock = () => {
    setConfirmAction('block')
  }

  /*
   * CONFIRM REPORT / BLOCK
   */
  const confirmCurrentAction = () => {
    if (!user) return

    if (confirmAction === 'report') {
      setConfirmAction(null)

      showToast(
        `Thanks, we'll review ${user.name}'s profile`,
        'info',
      )

      return
    }

    const next = !isBlocked

    const currentBlockedUsers =
      readStoredBlockedUsers()

    const nextBlockedUsers = next
      ? [
          ...new Set([
            ...currentBlockedUsers,
            user.id,
          ]),
        ]
      : currentBlockedUsers.filter(
          (blockedUser) =>
            blockedUser !== user.id &&
            blockedUser !== user.name,
        )

    persistBlockedUsers(
      nextBlockedUsers,
    )

    /*
     * Remove like when blocking
     */
    if (next && isLiked(user.id)) {
      removeLike(user.id)
    }

    setIsBlocked(next)
    setConfirmAction(null)

    showToast(
      next
        ? `${user.name} has been blocked`
        : `${user.name} is no longer blocked`,
      next ? 'success' : 'info',
    )
  }

  /*
   * LOADING
   */
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl items-center justify-center px-4">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  /*
   * NOT FOUND
   */
  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl items-center justify-center px-4">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">
            Profile not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This user profile is not available.
          </p>

          <div className="mt-5">
            <PillButton
              variant="outline"
              onClick={() => router.back()}
            >
              Go back
            </PillButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* CONFIRM MODAL */}

      <Modal
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null)
          }
        }}
        title={
          confirmAction === 'block'
            ? 'Block this profile?'
            : 'Report this profile?'
        }
        description={
          confirmAction === 'block'
            ? `This will hide ${user.name} from your profile feed and add them to your block list.`
            : `We'll review ${user.name}'s profile to check if it violates our community guidelines.`
        }
      >
        <div className="flex gap-2">
          <PillButton
            block
            variant="outline"
            onClick={() =>
              setConfirmAction(null)
            }
          >
            Cancel
          </PillButton>

          <PillButton
            block
            onClick={confirmCurrentAction}
          >
            {confirmAction === 'block'
              ? isBlocked
                ? 'Unblock'
                : 'Block'
              : 'Report'}
          </PillButton>
        </div>
      </Modal>

      {/* TOAST */}

      {toast && (
        <div
          className={cn(
            'fixed right-4 top-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg duration-300',

            toast.type === 'success' &&
              'bg-emerald-500 text-white',

            toast.type === 'error' &&
              'bg-destructive text-white',

            toast.type === 'info' &&
              'bg-slate-800 text-white',
          )}
        >
          {toast.type === 'success' ? (
            <Check className="size-4 shrink-0" />
          ) : (
            <Info className="size-4 shrink-0" />
          )}

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

      {/* PAGE */}

      <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">

          {/* LEFT PROFILE CARD */}

          <section className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm">

            <Avatar
              src={
                user.photo ??
                '/placeholder.svg'
              }
              alt={user.name}
              size="xl"
              ring
            />

            <div className="mt-4 flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {user.name}
                {user.age !== null &&
                  `, ${user.age}`}
              </h1>

              {user.verified && (
                <VerifiedBadge />
              )}
            </div>

            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4" />

              {user.location}
            </p>

            <div className="mt-5 flex w-full gap-2">

              <PillButton
                block
                variant={
                  isLiked(user.id)
                    ? 'secondary'
                    : 'primary'
                }
                onClick={handleLike}
              >
                <Heart
                  className={cn(
                    'size-4',
                    isLiked(user.id) &&
                      'fill-current',
                  )}
                />

                {isLiked(user.id)
                  ? 'Liked'
                  : 'Like'}
              </PillButton>

              <PillButton
                block
                variant="outline"
                onClick={handleMessage}
                disabled={isBlocked || isOpeningChat}
              >
                <MessageCircle className="size-4" />
                              
                {isBlocked
                  ? 'Blocked'
                  : isOpeningChat
                    ? 'Opening...'
                    : 'Message'}
              </PillButton>

            </div>
          </section>

          {/* RIGHT CONTENT */}

          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            {/* ABOUT */}

            <div className="mb-5">
              <h2 className="text-sm font-semibold">
                About
              </h2>

              <p className="mt-3 leading-relaxed text-muted-foreground">
                {user.bio ||
                  'No bio yet.'}
              </p>
            </div>

            <hr />

            {/* INTERESTS */}

            <div className="my-5">
              <h2 className="text-sm font-semibold">
                Interests
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">

                {user.interests.length > 0 ? (
                  user.interests.map(
                    (interest) => (
                      <Tag
                        key={interest}
                        active
                      >
                        {interest}
                      </Tag>
                    ),
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No interests yet.
                  </p>
                )}

              </div>
            </div>

            <hr />

            {/* PHOTOS */}

            <div className="mt-5">
              <h2 className="text-sm font-semibold">
                Photos
              </h2>

              <div className="mt-4 grid grid-cols-3 gap-3">

                {user.photos.length > 0 ? (
                  user.photos.map(
                    (photo, index) => (
                      <img
                        key={`${photo}-${index}`}
                        src={photo}
                        alt={`${user.name} photo ${
                          index + 1
                        }`}
                        className="aspect-[3/4] w-full rounded-2xl object-cover"
                      />
                    ),
                  )
                ) : (
                  <div className="col-span-3 flex aspect-[3/4] items-center justify-center rounded-2xl bg-secondary text-sm text-muted-foreground">
                    No photos
                  </div>
                )}

              </div>
            </div>

            <hr className="my-5" />

            {/* REPORT / BLOCK */}

            <div className="flex gap-2">

              <PillButton
                block
                variant="outline"
                onClick={handleReport}
              >
                <Flag className="size-4" />

                Report
              </PillButton>

              <PillButton
                block
                variant={
                  isBlocked
                    ? 'secondary'
                    : 'outline'
                }
                onClick={handleBlock}
              >
                <Ban className="size-4" />

                {isBlocked
                  ? 'Blocked'
                  : 'Block'}
              </PillButton>

            </div>
          </section>
        </div>
      </div>
    </>
  )
}