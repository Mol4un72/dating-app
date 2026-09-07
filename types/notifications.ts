export type NotificationType =
  | 'like'
  | 'match'
  | 'message'

export type Notification = {
  id: number
  type: NotificationType
  title: string
  description: string
  time: number
  unread: boolean
}
