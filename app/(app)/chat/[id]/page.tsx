import { ChatMessenger } from '@/components/chat/chat-messenger'

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ChatMessenger activeId={id} />
}
