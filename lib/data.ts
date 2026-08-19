export type Person = {
  id: number
  name: string
  age: number
  location: string
  distance: string
  bio: string
  interests: string[]
  photo: string
  photos: string[]
  verified: boolean
  sex: 'male' | 'female'
}

export type NotificationType =
  | 'like'
  | 'match'
  | 'message'

export type Notification = {
  id: number
  type: NotificationType
  title: string
  description: string
  time: string
  unread: boolean
}

export interface SettingsState {
  // Notifications
  newMatches: boolean
  newMessages: boolean
  superLikes: boolean
  appUpdates: boolean
  emailAlerts: boolean

  // Privacy
  profileVisibility: 'everyone' | 'verified' | 'incognito'
  showOnlineStatus: boolean
  shareData: boolean
  blockedUsers: string[]

  // Preferences
  interestedIn: string
  ageRange: string
  maxDistance: number
  verifiedOnly: boolean

  // Account
  email: string
  phone: string
  language: string
}

export type TabType = 'notifications' | 'privacy' | 'preferences' | 'account'

export interface PasswordState {
  current: string
  new: string
  confirm: string
}

export const people: Person[] = [
  {
    id: 0,
    sex: 'female',
    name: 'Sophie',
    age: 26,
    location: 'Brooklyn, NY',
    distance: '3 km away',
    bio: 'Coffee enthusiast, weekend hiker, and always looking for the next great book. Let’s trade playlists.',
    interests: ['Hiking', 'Coffee', 'Reading', 'Photography', 'Travel'],
    photo: '/people/sophie.png',
    photos: ['/people/sophie.png', '/people/mia.png', '/people/ava.png'],
    verified: true,
  },
  {
    id: 1,
    sex: 'male',
    name: 'James',
    age: 31,
    location: 'Manhattan, NY',
    distance: '5 km away',
    bio: 'Architect by day, home cook by night. I make an excellent negroni and a mean risotto.',
    interests: ['Cooking', 'Design', 'Wine', 'Cycling', 'Jazz'],
    photo: '/people/james.png',
    photos: ['/people/james.png', '/people/liam.png', '/people/noah.png'],
    verified: true,
  },
  {
    id: 2,
    sex: 'female',
    name: 'Mia',
    age: 24,
    location: 'Queens, NY',
    distance: '8 km away',
    bio: 'Artist and museum wanderer. Golden hour is my favorite time of day. Dogs over everything.',
    interests: ['Art', 'Museums', 'Dogs', 'Yoga', 'Film'],
    photo: '/people/mia.png',
    photos: ['/people/mia.png', '/people/sophie.png', '/people/ava.png'],
    verified: false,
  },
  {
    id: 3,
    sex: 'male',
    name: 'Liam',
    age: 29,
    location: 'Jersey City, NJ',
    distance: '11 km away',
    bio: 'Music producer chasing good vibes and better tacos. Will absolutely bring you to a live show.',
    interests: ['Music', 'Concerts', 'Food', 'Skating', 'Vinyl'],
    photo: '/people/liam.png',
    photos: ['/people/liam.png', '/people/james.png', '/people/noah.png'],
    verified: true,
  },
  {
    id: 4,
    sex: 'female',
    name: 'Ava',
    age: 28,
    location: 'Hoboken, NJ',
    distance: '13 km away',
    bio: 'Product designer, plant collector, and part-time baker. Ask me about my sourdough starter.',
    interests: ['Baking', 'Plants', 'Design', 'Running', 'Podcasts'],
    photo: '/people/ava.png',
    photos: ['/people/ava.png', '/people/mia.png', '/people/sophie.png'],
    verified: true,
  },
  {
    id: 5,
    sex: 'male',
    name: 'Noah',
    age: 27,
    location: 'Brooklyn, NY',
    distance: '4 km away',
    bio: 'Software engineer who’d rather be climbing. Weekends are for the mountains and slow mornings.',
    interests: ['Climbing', 'Coffee', 'Tech', 'Travel', 'Camping'],
    photo: '/people/noah.png',
    photos: ['/people/noah.png', '/people/liam.png', '/people/james.png'],
    verified: false,
  },
]

export type Conversation = {
  id: string
  personId: number
  name: string
  photo: string
  online: boolean
  lastMessage: string
  time: string
  unread: number
  messages: Message[]
}

export const conversations: Conversation[] = [
  {
    id: 'c1',
    personId: 0,
    name: 'Sophie',
    photo: '/people/sophie.png',
    online: true,
    lastMessage: 'That trail sounds perfect — Saturday?',
    time: '2m',
    unread: 2,
    messages: [
      { id: 'm1', fromMe: false, text: 'Hey! Loved your photos from the coast 🌊', time: '9:41 AM' },
      { id: 'm2', fromMe: true, text: 'Thank you! That was last summer in Maine', time: '9:42 AM' },
      {
        id: 'm3',
        fromMe: false,
        image: '/people/mia.png',
        text: 'Here’s one from my trip too',
        time: '9:44 AM',
      },
      {
        id: 'm4',
        fromMe: true,
        text: 'Okay that’s stunning 😍',
        time: '9:45 AM',
        reaction: '❤️',
      },
      { id: 'm5', fromMe: false, text: 'There’s a great trail nearby if you’re into hiking', time: '9:46 AM' },
      { id: 'm6', fromMe: true, text: 'I’m very into hiking. That trail sounds perfect — Saturday?', time: '9:47 AM' },
    ],
  },

  {
    id: 'c2',
    personId: 1,
    name: 'James',
    photo: '/people/james.png',
    online: true,
    lastMessage: 'I’ll send you the risotto recipe 🍚',
    time: '18m',
    unread: 0,
    messages: [
      {
        id: 'm7',
        fromMe: true,
        text: 'Are you still cooking tonight?',
        time: '8:12 AM',
      },
      {
        id: 'm8',
        fromMe: false,
        text: 'Yep! Thinking about making something Italian.',
        time: '8:14 AM',
      },
      {
        id: 'm9',
        fromMe: true,
        text: 'Pasta?',
        time: '8:15 AM',
      },
      {
        id: 'm10',
        fromMe: false,
        text: 'I was actually thinking risotto 🍚',
        time: '8:16 AM',
      },
      {
        id: 'm11',
        fromMe: true,
        text: 'That sounds way better. I’ve never made it properly.',
        time: '8:18 AM',
      },
      {
        id: 'm12',
        fromMe: false,
        text: 'I’ll send you the risotto recipe 🍚',
        time: '8:20 AM',
      },
    ],
  },

  {
    id: 'c3',
    personId: 2,
    name: 'Mia',
    photo: '/people/mia.png',
    online: false,
    lastMessage: 'The exhibit was unreal, you’d love it',
    time: '1h',
    unread: 0,
    messages: [
      {
        id: 'm13',
        fromMe: false,
        text: 'Have you been to the new gallery downtown?',
        time: '7:31 AM',
      },
      {
        id: 'm14',
        fromMe: true,
        text: 'Not yet. Is it worth checking out?',
        time: '7:34 AM',
      },
      {
        id: 'm15',
        fromMe: false,
        text: 'Absolutely. The photography section was incredible.',
        time: '7:36 AM',
      },
      {
        id: 'm16',
        fromMe: true,
        text: 'Okay, you’ve convinced me 😄',
        time: '7:38 AM',
      },
      {
        id: 'm17',
        fromMe: false,
        text: 'I knew you’d like it.',
        time: '7:40 AM',
        reaction: '❤️',
      },
      {
        id: 'm18',
        fromMe: false,
        text: 'The exhibit was unreal, you’d love it',
        time: '7:42 AM',
      },
    ],
  },

  {
    id: 'c4',
    personId: 3,
    name: 'Ava',
    photo: '/people/ava.png',
    online: false,
    lastMessage: 'Haha okay you win this round',
    time: '3h',
    unread: 0,
    messages: [
      {
        id: 'm19',
        fromMe: false,
        text: 'I still think my movie recommendation was better.',
        time: '6:02 AM',
      },
      {
        id: 'm20',
        fromMe: true,
        text: 'You mean the movie where absolutely nothing happened? 😂',
        time: '6:05 AM',
      },
      {
        id: 'm21',
        fromMe: false,
        text: 'It was atmospheric!',
        time: '6:07 AM',
      },
      {
        id: 'm22',
        fromMe: true,
        text: 'That’s a fancy way of saying boring.',
        time: '6:09 AM',
        reaction: '😂',
      },
      {
        id: 'm23',
        fromMe: false,
        text: 'Okay, what’s your pick then?',
        time: '6:11 AM',
      },
      {
        id: 'm24',
        fromMe: true,
        text: 'I’ll send you one tonight. Prepare to be impressed.',
        time: '6:13 AM',
      },
      {
        id: 'm25',
        fromMe: false,
        text: 'Haha okay you win this round',
        time: '6:15 AM',
      },
    ],
  },

  {
    id: 'c5',
    personId: 4,
    name: 'Liam',
    photo: '/people/liam.png',
    online: true,
    lastMessage: 'Got us tickets for Friday 🎶',
    time: '1d',
    unread: 1,
    messages: [
      {
        id: 'm26',
        fromMe: true,
        text: 'Did you see that the band is coming next month?',
        time: 'Yesterday',
      },
      {
        id: 'm27',
        fromMe: false,
        text: 'No way! Where are they playing?',
        time: 'Yesterday',
      },
      {
        id: 'm28',
        fromMe: true,
        text: 'At the old theater downtown.',
        time: 'Yesterday',
      },
      {
        id: 'm29',
        fromMe: false,
        text: 'We should definitely go.',
        time: 'Yesterday',
      },
      {
        id: 'm30',
        fromMe: true,
        text: 'I was thinking the same thing.',
        time: 'Yesterday',
      },
      {
        id: 'm31',
        fromMe: false,
        text: 'Did you manage to get tickets?',
        time: 'Yesterday',
      },
      {
        id: 'm32',
        fromMe: true,
        text: 'Got us tickets for Friday 🎶',
        time: 'Yesterday',
        reaction: '🔥',
      },
    ],
  },
]

export type Message = {
  id: string
  fromMe: boolean
  text?: string
  image?: string
  time: string
  reaction?: string
}

export const messages: Message[] = [
  { id: 'm1', fromMe: false, text: 'Hey! Loved your photos from the coast 🌊', time: '9:41 AM' },
  { id: 'm2', fromMe: true, text: 'Thank you! That was last summer in Maine', time: '9:42 AM' },
  {
    id: 'm3',
    fromMe: false,
    image: '/people/mia.png',
    text: 'Here’s one from my trip too',
    time: '9:44 AM',
  },
  {
    id: 'm4',
    fromMe: true,
    text: 'Okay that’s stunning 😍',
    time: '9:45 AM',
    reaction: '❤️',
  },
  { id: 'm5', fromMe: false, text: 'There’s a great trail nearby if you’re into hiking', time: '9:46 AM' },
  { id: 'm6', fromMe: true, text: 'I’m very into hiking. That trail sounds perfect — Saturday?', time: '9:47 AM' },
]

export const currentUser = {
  name: 'Elena',
  age: 27,
  location: 'Brooklyn, NY',
  photo: '/people/ava.png',
  verified: true,
  bio: 'Designer, amateur ceramicist, and forever chasing golden hour. Looking for someone to explore the city (and its coffee shops) with.',
  interests: ['Ceramics', 'Coffee', 'Design', 'Travel', 'Live music', 'Cooking'],
  photos: ['/people/ava.png', '/people/sophie.png', '/people/mia.png'],
  likedUsers: [] as number[],
  notifications: [
    {
      id: 1,
      type: 'like',
      title: 'Someone liked you',
      description: 'Emma liked your profile',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      type: 'match',
      title: 'New match 🎉',
      description: 'You matched with Olivia',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      type: 'message',
      title: 'New message',
      description: 'James sent you a message',
      time: 'Yesterday',
      unread: false,
    },
  ] as Notification[],
  Settings: {
    newMatches: true,
    newMessages: true,
    superLikes: true,
    appUpdates: false,
    emailAlerts: true,

    profileVisibility: 'everyone' as const,
    showOnlineStatus: true,
    shareData: true,
    blockedUsers: ['spammer.joe@example.com', 'ex.partner@example.com'],

    interestedIn: 'Everyone',
    ageRange: '25 – 35',
    maxDistance: 20,
    verifiedOnly: false,

    email: 'elena.kovalenko@example.com',
    phone: '+1 (555) 019-2834',
    language: 'English',
  }
}

export const Interests = [
  'Art',
  'Baking',
  'Camping',
  'Climbing',
  'Coffee',
  'Concerts',
  'Cooking',
  'Cycling',
  'Design',
  'Dogs',
  'Film',
  'Food',
  'Hiking',
  'Jazz',
  'Museums',
  'Music',
  'Photography',
  'Plants',
  'Podcasts',
  'Reading',
  'Running',
  'Skating',
  'Tech',
  'Travel',
  'Vinyl',
  'Wine',
  'Yoga',
  'Ceramics',
  'Live music',
]