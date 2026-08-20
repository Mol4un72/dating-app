import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { PillButton } from '@/components/pill-button'
import { NotFound } from '@/components/non-found'

export default function ConversationNotFound() {
  return (
    <NotFound
      className="min-h-[calc(100svh-var(--nav-h,4rem))] lg:min-h-svh"
      icon={
        <span className="grid size-16 place-items-center rounded-full bg-accent text-primary">
          <MessageCircle className="size-8" />
        </span>
      }
      title="Conversation not found"
      description="This conversation may have been removed or the link is no longer valid."
      action={
        <>
          <PillButton href="/chat">Back to messages</PillButton>
          <Link href="/discover" className="mt-4 block text-sm font-medium text-primary hover:underline">
            Discover people
          </Link>
        </>
      }
    />
  )
}
