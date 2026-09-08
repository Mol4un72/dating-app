export type Me = {
  id: string
  email: string
  name: string | null
  age: number | null
  gender: string | null
  location: string | null
  bio: string | null
  verified: boolean
  phone: string | null
  language: string
  photos: { id: string, url: string }[]
  interests: string[]
  notifications: {
    id: string
    type: 'like' | 'match' | 'message'
    title: string
    description: string
    unread: boolean
    createdAt: string
  }[]
  settings: {
    id: string
    interestedIn: string
    ageRange: string
    maxDistance: number
    theme: string
  } | null
}

export type Draft = Me & {
  filters: {
    interestedIn: string
    ageRange: string
  }
}