import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { FiltersProvider } from '@/context/filters-context'
import { LikesProvider } from '@/context/likes-context'

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
        <AppShell>{children}</AppShell>
      </FiltersProvider>
    </LikesProvider>
  )
}