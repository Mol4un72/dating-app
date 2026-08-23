import { notFound } from 'next/navigation'
import { ChatMessenger } from '@/components/chat/chat-messenger'
import { conversations } from '@/lib/data'

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const conversationId = Number(id)

  if (!Number.isInteger(conversationId) || !conversations.some((conversation) => conversation.id === conversationId)) {
    notFound()
  }

  return <ChatMessenger activeId={conversationId} />
}
