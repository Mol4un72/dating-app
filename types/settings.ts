export interface SettingsState {
  // Notifications
  newMatches: boolean
  newMessages: boolean
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

  // Account
  theme: 'light' | 'dark' | 'system'
  email: string
  phone: string
  language: string
}