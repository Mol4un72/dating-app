import { notFound } from 'next/navigation'
import { ChatMessenger } from '@/components/chat/chat-messenger'
import { conversations } from '@/lib/data'

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!conversations.some((conversation) => conversation.id === id)) {
    notFound()
  }

  return <ChatMessenger activeId={id} />
}
