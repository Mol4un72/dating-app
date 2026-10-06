'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { cn } from '@/lib/utils'
import { NotFound } from '@/components/non-found'
import { PillButton } from '@/components/pill-button'
import { ConversationComponent } from './conversation'
import type { Conversation } from '@/types/conversation'

export function ChatMessenger({ activeId }: { activeId?: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const active = activeId
    ? conversations.find((c) => c.id === activeId)
    : undefined

  useEffect(() => {
    async function loadConversations() {
      try {
        const response = await fetch('/api/conversations')

        if (!response.ok) {
          throw new Error('Failed to load conversations')
        }

        const data = await response.json()
        setConversations(data)
      } catch (error) {
        console.error('Failed to load conversations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConversations()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-var(--nav-h,4rem))] w-full items-center justify-center lg:h-svh">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (activeId && !active) {
    return (
      <NotFound
        className="min-h-[calc(100svh-var(--nav-h,4rem))] lg:min-h-svh"
        title="Conversation not found"
        description="This conversation may have been removed or the link is no longer valid."
        action={<PillButton href="/chat">Back to messages</PillButton>}
      />
    )
  }

  return (
    <div className="flex h-[calc(100svh-var(--nav-h,4rem))] w-full lg:h-svh overflow-hidden">
      {/* Conversation list */}
      <div
        className={cn(
          'flex w-full flex-col border-r border-border lg:w-80 lg:shrink-0',
          activeId && 'hidden lg:flex',
        )}
      >
        <div className="h-16 sticky top-0 z-10 border-b border-border bg-background/85 px-4 py-4 backdrop-blur-lg">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Messages</h1>
        </div>
        {conversations.length === 0 &&
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-accent text-primary">
              <MessageCircle className="size-8" />
            </span>
            <p className="text-lg font-semibold text-foreground">No messages yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              You have not started any conversations yet. Start chatting with your matches!
            </p>
          </div>
        }
        <ul className="flex-1 overflow-y-auto p-2">
          {conversations.map((c) => (
            <li 
              key={c.id}
            >
              <Link
                href={`/chat/${c.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-secondary',
                  c.id === activeId && 'bg-accent',
                )}
              >
                <Avatar src={c.photo} alt={c.name} size="md" online={c.online} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold text-foreground">{c.name}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        'truncate text-sm',
                        c.unread ? 'font-medium text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {c.lastMessage}
                    </p>
                    {c.unread > 0 && (
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[0.7rem] font-bold text-primary-foreground">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Conversation pane */}
      <div className={cn('flex min-h-0 flex-1 flex-col', !activeId && 'hidden lg:flex')}>
        {active ? (
          <ConversationComponent
            key={active.id}
            conversationId={active.id}
            name={active.name}
            photo={active.photo}
            online={active.online}
            personId={active.personId}
          />
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center gap-3 p-8 text-center lg:flex">
            <span className="grid size-16 place-items-center rounded-full bg-accent text-primary">
              <MessageCircle className="size-8" />
            </span>
            <p className="text-lg font-semibold text-foreground">Your messages</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Select a conversation to start chatting with your matches.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}