import { AppShell } from '@/components/app-shell'
import { FiltersProvider } from '@/context/filters-context'

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FiltersProvider>
      <AppShell>{children}</AppShell>
    </FiltersProvider>
  )
}