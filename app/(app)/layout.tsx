import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { FiltersProvider } from '@/context/filters-context'
import { LikesProvider } from '@/context/likes-context'
import { Toaster } from 'sonner'
import NotificationsToast from '@/components/notifications-toast'

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <LikesProvider>
      <FiltersProvider>
        <AppShell>
          <Toaster />
            <NotificationsToast />
              {children}
        </AppShell>
      </FiltersProvider>
    </LikesProvider>
  )
}