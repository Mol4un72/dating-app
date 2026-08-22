'use client'

import { useState, useEffect } from 'react'
import { Bell, Shield, Heart, LogOut, ChevronRight, MapPin, User, Trash2, Check, X, ArrowLeft, Info } from 'lucide-react'
import { VerifiedBadge } from '@/components/tag'
import { AppTopBar } from '@/components/app-topbar'
import { Avatar } from '@/components/avatar'
import { PillButton } from '@/components/pill-button'
import { TabPanel } from '@/components/tab-panel'
import { Field, Input } from '@/components/field'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/data'
import type { SettingsState, PasswordState, TabType } from '@/lib/data'
import { useRouter } from 'next/navigation'
import { useFilters } from '@/context/filters-context'
import { useTheme } from '@/context/theme-context'

const STORAGE_KEY = 'lumi_settings'

export default function SettingsPage() {
  const router = useRouter()
  const { theme: activeTheme, setTheme: setActiveTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedTab, setSelectedTab] = useState<TabType | null>(null)
  const [settings, setSettings] = useState<SettingsState>({
    ...currentUser.Settings,
    theme: activeTheme,
  })

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
          const parsed = JSON.parse(saved)
          setSettings(parsed)
          if (parsed.theme) {
            setActiveTheme(parsed.theme)
          }
        }
      } catch (e) {
        console.error('Failed to load settings', e)
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [setActiveTheme])

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
    if (key === 'theme') {
      setActiveTheme(value as 'light' | 'dark' | 'system')
    }
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
            type="button"
            onClick={() => selectedTab ? setSelectedTab(null) : router.push('/profile')}
            className="lg:hidden flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                    type="button"
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
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
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <LogOut className="size-5 shrink-0" />
                  <span className="text-sm font-semibold">Log out</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
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
                    type="button"
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
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
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <LogOut className="size-5 shrink-0" />
                <span className="text-sm font-semibold">Log out</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
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
                type="button"
                aria-label="Close delete account dialog"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
