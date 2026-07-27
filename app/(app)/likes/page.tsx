import { Heart, Star, MapPin } from 'lucide-react'
import { AppTopBar } from '@/components/app-topbar'
import { VerifiedBadge } from '@/components/tag'
import { people } from '@/lib/data'

export default function LikesPage() {
  return (
    <>
      <AppTopBar title="Likes" />
      <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {people.length} people like you
            </h1>
            <p className="text-sm text-muted-foreground">Like them back to start a conversation.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-primary">
            <Star className="size-4 fill-primary" /> Premium
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {people.map((person) => (
            <article
              key={person.id}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={person.photo || '/placeholder.svg'}
                  alt={person.name}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-background">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold">
                      {person.name}, {person.age}
                    </p>
                    {person.verified && <VerifiedBadge className="text-background" />}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-background/80">
                    <MapPin className="size-3" /> {person.distance}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Like ${person.name}`}
                  className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-background/90 text-primary shadow-md backdrop-blur transition-transform active:scale-90"
                >
                  <Heart className="size-5 fill-current" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
