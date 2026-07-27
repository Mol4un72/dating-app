'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Pencil,
  Settings,
  Heart,
  Ruler,
  Users,
  ChevronRight,
  Bell,
  Shield,
  LogOut,
} from 'lucide-react'
import { AppTopBar } from '@/components/app-topbar'
import { Avatar } from '@/components/avatar'
import { Tag, VerifiedBadge } from '@/components/tag'
import { PillButton } from '@/components/pill-button'
import { Modal } from '@/components/modal'
import { Field, Input } from '@/components/field'
import { currentUser } from '@/lib/data'

export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <AppTopBar
        title="Profile"
        actions={
          <button
            type="button"
            aria-label="Settings"
            className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
          >
            <Settings className="size-5" />
          </button>
        }
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          {/* Left: identity + info */}
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
              <div className="mt-5 flex w-full gap-2">
                <PillButton block onClick={() => setEditOpen(true)}>
                  <Pencil className="size-4" /> Edit profile
                </PillButton>
                <PillButton variant="outline" className="shrink-0" aria-label="Settings">
                  <Settings className="size-4" />
                </PillButton>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
              <ul className="mt-4 flex flex-col gap-4">
                <PreferenceRow icon={Users} label="Interested in" value={currentUser.preferences.interestedIn} />
                <PreferenceRow icon={Ruler} label="Age range" value={currentUser.preferences.ageRange} />
                <PreferenceRow icon={MapPin} label="Distance" value={currentUser.preferences.distance} />
              </ul>
            </section>

            <section className="rounded-3xl border border-border bg-card p-2 shadow-sm">
              <SettingsRow icon={Bell} label="Notifications" />
              <SettingsRow icon={Shield} label="Privacy & safety" />
              <SettingsRow icon={Heart} label="Dating preferences" />
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="size-5" />
                <span className="text-sm font-medium">Log out</span>
              </Link>
            </section>
          </div>

          {/* Right: about + interests + gallery */}
          <div className="flex flex-col gap-6">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">About me</h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {currentUser.bio}
              </p>
            </section>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Interests</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => (
                  <Tag key={interest} active>
                    {interest}
                  </Tag>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Photos</h2>
                <button className="text-sm font-medium text-primary hover:underline">Manage</button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {currentUser.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo || '/placeholder.svg'}
                    alt={`Photo ${i + 1}`}
                    className="aspect-[3/4] w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit profile"
        description="Update how you appear to others."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setEditOpen(false)
          }}
          className="flex flex-col gap-4"
        >
          <Field label="Name" htmlFor="edit-name">
            <Input id="edit-name" defaultValue={currentUser.name} />
          </Field>
          <Field label="Location" htmlFor="edit-location">
            <Input id="edit-location" defaultValue={currentUser.location} />
          </Field>
          <Field label="About me" htmlFor="edit-bio">
            <textarea
              id="edit-bio"
              defaultValue={currentUser.bio}
              rows={4}
              className="w-full rounded-xl border border-border bg-card p-4 text-[0.95rem] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>
          <PillButton type="submit" block size="lg" className="mt-1">
            Save changes
          </PillButton>
        </form>
      </Modal>
    </>
  )
}

function PreferenceRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-primary">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-1 items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </li>
  )
}

function SettingsRow({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-secondary">
      <Icon className="size-5 text-foreground" />
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  )
}
