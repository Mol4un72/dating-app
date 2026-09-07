export type Conversation = {
  id: string
  personId: string
  name: string
  photo: string
  online: boolean
  lastMessage: string
  time: string
  unread: number
  messages: Message[]
}

export type Message = {
  id: string
  fromMe: boolean
  text?: string
  image?: string
  time: string
  reaction?: string
}