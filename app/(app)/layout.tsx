import { AppShell } from '@/components/app-shell'
import { FiltersProvider } from '@/context/filters-context'
import { LikesProvider } from '@/context/likes-context'

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LikesProvider>
      <FiltersProvider>
        <AppShell>{children}</AppShell>
      </FiltersProvider>
    </LikesProvider>
  )
}