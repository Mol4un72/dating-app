import { MapPin } from "lucide-react"
import { VerifiedBadge } from '@/components/tag'
import { type Person } from '@/lib/data'

export function LikedCard({
    person,
    onDislike,
}: {
    person: Person
    onDislike: () => void
}) {
  
    return (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white/80">
                    <div className="flex items-center gap-1">
                        <p className="font-semibold">
                            {person.name}, {person.age}
                        </p>
                        {person.verified && <VerifiedBadge className="text-white/80" />}
                    </div>
                    <p className="flex items-center gap-1 text-xs text-white/80">
                        <MapPin className="size-3" /> {person.distance}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onDislike}
                    className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 text-[20px] text-primary shadow-md backdrop-blur transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`Remove ${person.name} from likes`}
                >
                    ❤️
                </button>
            </div>
        </article>
    )
}
