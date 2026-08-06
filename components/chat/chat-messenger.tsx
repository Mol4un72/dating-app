'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Send,
  Smile,
  MessageCircle,
  EllipsisVertical,
} from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { conversations, messages as seedMessages, type Message } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ChatMessenger({ activeId }: { activeId?: string }) {
  const active = activeId
    ? conversations.find((c) => c.id === activeId) ?? conversations[0]
    : undefined

  return (
    <div className="flex h-[calc(100svh-4rem)] w-full lg:h-svh overflow-hidden">
      {/* Conversation list */}
      <div
        className={cn(
          'flex w-full flex-col border-r border-border lg:w-80 lg:shrink-0',
          activeId && 'hidden lg:flex',
        )}
      >
        <div className="sticky top-0 z-10 border-b border-border bg-background/85 px-4 py-4 backdrop-blur-lg">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Messages</h1>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {conversations.map((c) => (
            <li key={c.id}>
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
          <Conversation
            name={active.name}
            photo={active.photo}
            online={active.online}
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

function Conversation({
  name,
  photo,
  online,
}: {
  name: string
  photo: string
  online: boolean
}) {
  const [items, setItems] = useState<Message[]>(seedMessages)
  const [draft, setDraft] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
    })
  }, [items])

  function send() {
    const text = draft.trim()
    if (!text) return

    setItems((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        fromMe: true,
        text,
        time: 'Now',
      },
    ])

    setDraft('')
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            aria-label="Back to messages"
            className="grid size-9 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <Avatar src={photo} alt={name} size="sm" online={online} />
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{online ? 'Active now' : 'Offline'}</p>
          </div>
        </div>
        <button>
          <EllipsisVertical 
            className='size-6'
          />
        </button>
      </header>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-secondary/30 p-4 pb-24 lg:pb-4">
        <p className="mx-auto rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          You matched with {name}
        </p>
        {items.map((m) => (
          <Bubble key={m.id} message={m} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 z-20 flex items-center gap-2 border-t border-border bg-card p-3">
        <button className="grid size-10 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary" aria-label="Add attachment">
          <Plus className="size-5" />
        </button>
        <div className="flex flex-1 items-center rounded-full bg-secondary pr-2">
          <input
            inputMode="text"
            enterKeyHint="send"
            autoComplete="off"
            value={draft}
            ref={inputRef}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Type a message"
            className="h-11 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button className="grid size-8 place-items-center rounded-full text-muted-foreground hover:text-foreground" aria-label="Emoji">
            <Smile className="size-5" />
          </button>
        </div>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            send()
          }}
          aria-label="Send message"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-90"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  )
}

function Bubble({ message }: { message: Message }) {
  const { fromMe, text, image, time, reaction } = message
  return (
    <div className={cn('flex flex-col', fromMe ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'relative max-w-[78%] overflow-hidden shadow-sm',
          image ? 'rounded-2xl' : 'rounded-2xl px-4 py-2.5',
          fromMe
            ? 'bg-primary text-primary-foreground'
            : 'bg-card text-foreground',
        )}
      >
        {image && (
          <img src={image || '/placeholder.svg'} alt="Shared" className="h-44 w-56 object-cover" />
        )}
        {text && (
          <p className={cn('text-sm leading-relaxed', image && 'px-4 py-2.5')}>{text}</p>
        )}
        {reaction && (
          <span className="absolute -bottom-2 right-2 rounded-full border border-border bg-card px-1 text-xs shadow-sm">
            {reaction}
          </span>
        )}
      </div>
      <span className="mt-1 px-1 text-[0.7rem] text-muted-foreground">{time}</span>
    </div>
  )
}
