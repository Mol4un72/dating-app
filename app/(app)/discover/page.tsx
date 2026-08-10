import { AppTopBar } from '@/components/app-topbar'
import { SwipeDeck } from '@/components/people/swipe-deck'
import { NotificationsButton } from '@/components/notifications-button'
import { people } from '@/lib/data'

export default function DiscoverPage() {
  return (
    <>
      <AppTopBar
        actions={<NotificationsButton />}
      />

      <div className="mx-auto flex h-[calc(100svh-8rem)] min-h-0 w-full max-w-2xl flex-col lg:h-[calc(100svh-4rem)]">
        <SwipeDeck people={people} />
      </div>
    </>
  )
}
