import { Bell, Shield, Heart, LogOut, ChevronRight, MapPin } from 'lucide-react'
import { VerifiedBadge } from '@/components/tag'
import { AppTopBar } from '@/components/app-topbar'
import { Avatar } from '@/components/avatar'
import Link from 'next/link'
import { currentUser } from '@/lib/data'

export default function SettingsPage() {
    return (
        <>
            <AppTopBar title="Settings"/>
            <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
                <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
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
            </div>
        </>
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