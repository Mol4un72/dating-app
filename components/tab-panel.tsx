import { Languages, Lock, Mail, Phone } from 'lucide-react'

import { Tag } from '@/components/tag'
import { Field, Input, Select } from '@/components/field'
import { PillButton } from '@/components/pill-button'
import { Switch } from '@/components/switch'

import type { SettingsState, TabType, PasswordState } from '@/lib/data'

export function TabPanel({
  tab,
  settings,
  filters,
  setFilters,
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
              <h3 className="text-sm font-semibold text-foreground">
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
            {/* Theme Selection */}
            <Field label="App Theme" htmlFor="account-theme">
              <div className="flex flex-wrap gap-2">
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <Tag
                    active={settings.theme === theme}
                    key={theme}
                    onClick={() => onValueChange('theme', theme)}
                    className="cursor-pointer select-none w-fit"
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Tag>
                ))}
              </div>
            </Field>

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