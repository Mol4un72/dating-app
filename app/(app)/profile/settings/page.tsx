'use client'

import { useState, useEffect } from 'react'
import { Bell, Shield, Heart, LogOut, ChevronRight, MapPin, User, Trash2, Check, Plus, X, ArrowLeft, Languages, Lock, Mail, Phone, Info } from 'lucide-react'
import { Tag, VerifiedBadge } from '@/components/tag'
import { AppTopBar } from '@/components/app-topbar'
import { Avatar } from '@/components/avatar'
import { PillButton } from '@/components/pill-button'
import { Field, Input, Select } from '@/components/field'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/data'
import { useRouter } from 'next/navigation'
import { useFilters } from '@/context/filters-context'

type TabType = 'notifications' | 'privacy' | 'preferences' | 'account'

interface SettingsState {
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

interface PasswordState {
  current: string
  new: string
  confirm: string
}

const STORAGE_KEY = 'lumi_settings'

const defaultSettings: SettingsState = {
  newMatches: true,
  newMessages: true,
  superLikes: true,
  appUpdates: false,
  emailAlerts: true,

  profileVisibility: 'everyone',
  showOnlineStatus: true,
  shareData: true,
  blockedUsers: ['spammer.joe@example.com', 'ex.partner@example.com'],

  interestedIn: currentUser.preferences?.interestedIn || 'Everyone',
  ageRange: currentUser.preferences?.ageRange || '25 – 35',
  maxDistance: parseInt(currentUser.preferences?.distance || '20'),
  verifiedOnly: false,

  email: 'elena.kovalenko@example.com',
  phone: '+1 (555) 019-2834',
  language: 'English'
}

export default function SettingsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedTab, setSelectedTab] = useState<TabType | null>(null)
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)

  const { filters, setFilters } = useFilters()

  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Password change state
  const [passwordState, setPasswordState] = useState<PasswordState>({
    current: '',
    new: '',
    confirm: ''
  })

  // Blocked user input state
  const [newBlockedUser, setNewBlockedUser] = useState('')

  // Check client-side mount & load settings
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      // Default to 'notifications' on desktop
      if (window.innerWidth >= 1024) {
        setSelectedTab('notifications')
      }
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          setSettings(JSON.parse(saved))
        }
      } catch (e) {
        console.error('Failed to load settings', e)
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Save settings helper
  const saveSettings = (newSettings: SettingsState) => {
    setSettings(newSettings)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    } catch (e) {
      console.error('Failed to save settings', e)
    }
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Toggles update handlers
  const handleToggle = (key: keyof SettingsState) => {
    const updated = { ...settings, [key]: !settings[key] } as SettingsState
    saveSettings(updated)
  }

  // General field update handler
  const handleValueChange = (key: keyof SettingsState, value: string | number | boolean) => {
    const updated = { ...settings, [key]: value } as SettingsState
    saveSettings(updated)
  }

  // Handle blocking a user
  const handleBlockUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlockedUser.trim()) return
    if (!newBlockedUser.includes('@') && newBlockedUser.length < 5) {
      showToast('Please enter a valid email or phone number', 'error')
      return
    }
    if (settings.blockedUsers.includes(newBlockedUser.trim())) {
      showToast('User is already blocked', 'error')
      return
    }
    const updated = {
      ...settings,
      blockedUsers: [...settings.blockedUsers, newBlockedUser.trim()]
    }
    saveSettings(updated)
    setNewBlockedUser('')
    showToast('User blocked successfully')
  }

  // Handle unblocking
  const handleUnblockUser = (user: string) => {
    const updated = {
      ...settings,
      blockedUsers: settings.blockedUsers.filter(u => u !== user)
    }
    saveSettings(updated)
    showToast('User unblocked')
  }

  // Change password handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordState.current || !passwordState.new || !passwordState.confirm) {
      showToast('Please fill all password fields', 'error')
      return
    }
    if (passwordState.new !== passwordState.confirm) {
      showToast('New passwords do not match', 'error')
      return
    }
    if (passwordState.new.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return
    }

    // Simulate successful password change
    showToast('Password updated successfully')
    setPasswordState({ current: '', new: '', confirm: '' })
  }

  // Delete account handler
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      showToast('Please type DELETE to confirm', 'error')
      return
    }
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      setShowDeleteModal(false)
      showToast('Account deleted successfully')
      localStorage.removeItem(STORAGE_KEY)
      router.push('/register')
    }, 2000)
  }

  // Logout handler
  const handleLogout = () => {
    router.push('/login')
  }

  if (!mounted) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const tabList = [
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell, desc: 'Alerts, push messages and email digests' },
    { id: 'privacy' as TabType, label: 'Privacy & safety', icon: Shield, desc: 'Profile visibility, status, blocked contacts' },
    { id: 'preferences' as TabType, label: 'Dating preferences', icon: Heart, desc: 'Matching filters, age ranges and distance' },
    { id: 'account' as TabType, label: 'Account settings', icon: User, desc: 'Contact details, password reset, languages' },
  ]

  return (
    <>
      <AppTopBar
        title={selectedTab ? tabList.find(t => t.id === selectedTab)?.label : "Settings"}
        actions={
          <button
            onClick={() => selectedTab ? setSelectedTab(null) : router.push('/profile')}
            className="lg:hidden flex items-center gap-1 text-sm font-medium text-primary hover:underline px-3 py-1.5"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        }
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-4 duration-300",
            toast.type === 'success' ? "bg-emerald-500 text-white" : "bg-destructive text-white"
          )}
        >
          {toast.type === 'success' ? <Check className="size-4 shrink-0" /> : <Info className="size-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
        {/* Mobile View: Shows either menu list or active tab details */}
        <div className="lg:hidden">
          {selectedTab === null ? (
            <div className="flex flex-col gap-6">
              {/* Profile Card */}
              <section className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
                <Avatar src={currentUser.photo} alt={currentUser.name} size="xl" ring />
                <div className="mt-4 flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {currentUser.name}, {currentUser.age}
                  </h1>
                  {currentUser.verified && <VerifiedBadge />}
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-4" /> {currentUser.location}
                </p>
              </section>

              {/* Navigation List */}
              <section className="rounded-3xl border border-border bg-card p-2 shadow-sm flex flex-col gap-1">
                {tabList.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-secondary"
                  >
                    <tab.icon className="size-5 text-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-foreground">{tab.label}</span>
                      <span className="block text-xs text-muted-foreground truncate mt-0.5">{tab.desc}</span>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </section>

              {/* Danger/Action List */}
              <section className="rounded-3xl border border-border bg-card p-2 shadow-sm flex flex-col gap-1">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-destructive/10 text-destructive"
                >
                  <LogOut className="size-5 shrink-0" />
                  <span className="text-sm font-semibold">Log out</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="size-5 shrink-0" />
                  <span className="text-sm font-semibold">Delete account</span>
                </button>
              </section>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <TabPanel
                tab={selectedTab}
                settings={settings}
                filters={filters}
                setFilters={setFilters}
                onToggle={handleToggle}
                onValueChange={handleValueChange}
                blockedUsers={settings.blockedUsers}
                onBlockUser={handleBlockUser}
                onUnblockUser={handleUnblockUser}
                newBlockedUser={newBlockedUser}
                setNewBlockedUser={setNewBlockedUser}
                passwordState={passwordState}
                setPasswordState={setPasswordState}
                onPasswordSubmit={handlePasswordSubmit}
              />
            </div>
          )}
        </div>

        {/* Desktop View: Two Columns Side-by-Side */}
        <div className="hidden lg:grid grid-cols-[280px_1fr] gap-8 items-start">
          {/* Left Column: Profile Card & Sidebar Menu */}
          <div className="flex flex-col gap-6">
            <section className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
              <Avatar src={currentUser.photo} alt={currentUser.name} size="xl" ring />
              <div className="mt-4 flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {currentUser.name}, {currentUser.age}
                </h1>
                {currentUser.verified && <VerifiedBadge />}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {currentUser.location}
              </p>
            </section>

            {/* Category Select Navigation */}
            <section className="rounded-3xl border border-border bg-card p-2 shadow-sm flex flex-col gap-1">
              {tabList.map(tab => {
                const Icon = tab.icon
                const active = selectedTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all',
                      active
                        ? 'bg-accent text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Icon className={cn("size-5 shrink-0", active ? "text-primary" : "text-foreground")} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                )
              })}

              <hr className="my-2 border-border" />

              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-destructive/10 text-destructive"
              >
                <LogOut className="size-5 shrink-0" />
                <span className="text-sm font-semibold">Log out</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="size-5 shrink-0" />
                <span className="text-sm font-semibold">Delete account</span>
              </button>
            </section>
          </div>

          {/* Right Column: Dynamic Form Container */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm min-h-[450px]">
            {selectedTab ? (
              <TabPanel
                tab={selectedTab}
                settings={settings}
                filters={filters}
                setFilters={setFilters}
                onToggle={handleToggle}
                onValueChange={handleValueChange}
                blockedUsers={settings.blockedUsers}
                onBlockUser={handleBlockUser}
                onUnblockUser={handleUnblockUser}
                newBlockedUser={newBlockedUser}
                setNewBlockedUser={setNewBlockedUser}
                passwordState={passwordState}
                setPasswordState={setPasswordState}
                onPasswordSubmit={handlePasswordSubmit}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <Shield className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold text-foreground">Select a settings tab</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Choose any category on the left to customize your dating profile preferences and security.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl animate-in scale-in duration-200">
            <h3 className="text-lg font-bold text-foreground">Log out</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to log out of Lumi? You will need to enter your details again to log back in.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <PillButton block onClick={handleLogout}>Yes, log out</PillButton>
              <PillButton block variant="outline" onClick={() => setShowLogoutModal(false)}>Cancel</PillButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl animate-in scale-in duration-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-destructive">Delete Account</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This action is permanent. All your matches, chat logs, pictures, and preference configurations will be deleted immediately.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <Field label="To confirm, type 'DELETE' below:" htmlFor="delete-confirm">
                <Input
                  id="delete-confirm"
                  placeholder="DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  disabled={isDeleting}
                />
              </Field>

              <div className="flex gap-3 mt-2">
                <PillButton
                  block
                  variant="primary"
                  className="bg-destructive hover:bg-destructive/95 border-none"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete permanently'}
                </PillButton>
                <PillButton
                  block
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmText('')
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </PillButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* Switch Custom Component */
function Switch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
}

/* Dynamic Tab Panel Component */
function TabPanel({
  tab,
  settings,
  filters,
  setFilters,
  onBlockUser,
  onToggle,
  onValueChange,
  blockedUsers,
  onUnblockUser,
  passwordState,
  setPasswordState,
  onPasswordSubmit
}: {
  tab: TabType
  settings: SettingsState
  filters: { interestedIn: string, ageRange: string, distance: string }
  setFilters: React.Dispatch<React.SetStateAction<{ interestedIn: string, ageRange: string, distance: string }>>
  onToggle: (key: keyof SettingsState) => void
  onValueChange: (key: keyof SettingsState, value: string | number | boolean) => void
  blockedUsers: string[]
  onBlockUser: (e: React.FormEvent) => void
  onUnblockUser: (user: string) => void
  newBlockedUser: string
  setNewBlockedUser: (val: string) => void
  passwordState: PasswordState
  setPasswordState: React.Dispatch<React.SetStateAction<PasswordState>>
  onPasswordSubmit: (e: React.FormEvent) => void
}) {
  switch (tab) {
    case 'notifications':
      return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Customize how and when you receive push notifications and emails from Lumi.
            </p>
          </div>

          <div className="flex flex-col gap-1 divide-y divide-border/60">
            <div className="flex items-center justify-between py-4">
              <div className="pr-4">
                <h3 className="text-sm font-semibold text-foreground">New Matches</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Receive alert when you get a new profile match.</p>
              </div>
              <Switch checked={settings.newMatches} onChange={() => onToggle('newMatches')} />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="pr-4">
                <h3 className="text-sm font-semibold text-foreground">New Messages</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Receive notifications for incoming chat messages.</p>
              </div>
              <Switch checked={settings.newMessages} onChange={() => onToggle('newMessages')} />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="pr-4">
                <h3 className="text-sm font-semibold text-foreground">Likes Messages</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Get notified when someone likes you.</p>
              </div>
              <Switch checked={settings.superLikes} onChange={() => onToggle('superLikes')} />
            </div>
          </div>
        </div>
      )

    case 'privacy':
      return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">Privacy & safety</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your profile visibility, online visibility status, and block unwanted contacts.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Visibility Selector */}
            <Field label="Who can see my profile:" htmlFor="visibility-select">
              <Select
                id="visibility-select"
                value={settings.profileVisibility}
                onChange={(e) => onValueChange('profileVisibility', e.target.value)}
              >
                <option value="everyone">Everyone on Lumi</option>
                <option value="verified">Verified users only</option>
                <option value="incognito">Incognito (Only people I liked)</option>
              </Select>
            </Field>

            <div className="flex items-center justify-between py-2">
              <div className="pr-4">
                <h3 className="text-sm font-semibold text-foreground">Show Active Status</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Show a green indicator on your avatar when you are online.</p>
              </div>
              <Switch checked={settings.showOnlineStatus} onChange={() => onToggle('showOnlineStatus')} />
            </div>

            <hr className="my-2 border-border" />

            {/* Blocked Contacts */}
            <div>
              <h3 className="text-sm font-semibold text-foreground">Blocked Contacts</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Blocked users cannot find your profile or send you messages.</p>

              <div className="mt-4 flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                {blockedUsers.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2 text-center bg-secondary/50 rounded-xl">
                    No blocked users yet.
                  </p>
                ) : (
                  blockedUsers.map((user) => (
                    <div key={user} className="flex items-center justify-between bg-secondary/60 rounded-xl px-3 py-2 text-sm">
                      <span className="text-foreground font-medium truncate pr-2">{user}</span>
                      <button
                        type="button"
                        onClick={() => onUnblockUser(user)}
                        className="text-xs font-semibold text-primary hover:underline hover:text-primary/80 shrink-0"
                      >
                        Unblock
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )

    case 'preferences':
      return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Dating preferences
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Specify your target matches&apos; profiles. Lumi will filter suggestions based on these settings.
            </p>
          </div>
      
          <div className="flex flex-col gap-6">
      
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Interested in
              </h3>
      
              <div className="mt-3 flex flex-wrap gap-2">
                {['Men', 'Women', 'Everyone'].map((gender) => (
                  <Tag
                    key={gender}
                    active={filters.interestedIn === gender}
                    className="cursor-pointer select-none"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        interestedIn: gender,
                      }))
                    }
                  >
                    {gender}
                  </Tag>
                ))}
              </div>
            </div>
              
              
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Age range
              </h3>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  '18 – 25',
                  '25 – 35',
                  '35 – 45',
                  '45+',
                ].map((item) => (
                  <Tag
                    key={item}
                    active={filters.ageRange === item}
                    className="cursor-pointer select-none"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        ageRange: item,
                      }))
                    }
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
              
              
            <div>
              <h3 className="text-sm-semibold text-foreground">
                Distance
              </h3>
              
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="51"
                  value={filters.distance}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      distance: e.target.value,
                    }))
                  }
                  className="w-full"
                />

                <div className="mt-3 text-center text-sm font-medium text-foreground">
                  {filters.distance === '51'
                    ? 'Any distance'
                    : `${filters.distance} km`}
                </div>
              </div>
            </div>
                  
          </div>
        </div>
      )

    case 'account':
      return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">Account settings</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update your account credentials, contact information, and display language.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Email field */}
            <Field label="Email Address" htmlFor="account-email">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="account-email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => onValueChange('email', e.target.value)}
                  className="pl-11"
                />
              </div>
            </Field>

            {/* Phone field */}
            <Field label="Phone Number" htmlFor="account-phone">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="account-phone"
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => onValueChange('phone', e.target.value)}
                  className="pl-11"
                />
              </div>
            </Field>

            {/* Language Selection */}
            <Field label="App Language" htmlFor="account-lang">
              <div className="relative">
                <Languages className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Select
                  id="account-lang"
                  value={settings.language}
                  onChange={(e) => onValueChange('language', e.target.value)}
                  className="pl-11"
                >
                  <option value="English">English</option>
                  <option value="Ukrainian">Українська (Ukrainian)</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="German">Deutsch (German)</option>
                  <option value="French">Français (French)</option>
                </Select>
              </div>
            </Field>

            <hr className="my-3 border-border" />

            {/* Password Change Form */}
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Lock className="size-4 text-primary" /> Change Password
              </h3>

              <form onSubmit={onPasswordSubmit} className="flex flex-col gap-4">
                <Field label="Current Password" htmlFor="pwd-current">
                  <Input
                    id="pwd-current"
                    type="password"
                    placeholder="••••••••"
                    value={passwordState.current}
                    onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                  />
                </Field>

                <Field label="New Password" htmlFor="pwd-new">
                  <Input
                    id="pwd-new"
                    type="password"
                    placeholder="••••••••"
                    value={passwordState.new}
                    onChange={(e) => setPasswordState({ ...passwordState, new: e.target.value })}
                  />
                </Field>

                <Field label="Confirm New Password" htmlFor="pwd-confirm">
                  <Input
                    id="pwd-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={passwordState.confirm}
                    onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                  />
                </Field>

                <PillButton
                  type="submit"
                  variant={passwordState.current && passwordState.new && passwordState.confirm ? "primary" : "outline"}
                  className="mt-1"
                >
                  Change Password
                </PillButton>
              </form>
            </div>
          </div>
        </div>
      )
  }
}