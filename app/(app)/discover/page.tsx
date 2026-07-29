import { Bell, Search } from 'lucide-react'
import { AppTopBar } from '@/components/app-topbar'
import { SwipeDeck } from '@/components/people/swipe-deck'
import { people } from '@/lib/data'

export default function DiscoverPage() {
  return (
    <>
      <AppTopBar
        actions={
          <>
            <button
              type="button"
              aria-label="Search"
              className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
            </button>
          </>
        }
      />

      <div className="mx-auto flex h-[calc(100svh-8rem)] min-h-0 w-full max-w-2xl flex-col lg:h-[calc(100svh-4rem)]">
        <SwipeDeck people={people} />
      </div>
    </>
  )
}
