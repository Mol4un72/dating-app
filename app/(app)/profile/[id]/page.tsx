import { notFound } from "next/navigation"
import {
  Heart,
  MapPin,
  MessageCircle,
  Flag,
  Ban,
} from "lucide-react"

import { people } from "@/lib/data"
import { Avatar } from "@/components/avatar"
import { Tag, VerifiedBadge } from "@/components/tag"
import { PillButton } from "@/components/pill-button"

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = people.find(
    (person) => person.id === Number(id)
  )

  if (!user) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">

        <section className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
          <Avatar
            src={user.photo}
            alt={user.name}
            size="xl"
            ring
          />

          <div className="mt-4 flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {user.name}, {user.age}
            </h1>

            {user.verified && <VerifiedBadge />}
          </div>

          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            {user.location}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {user.distance}
          </p>

          <div className="mt-5 flex w-full gap-2">
            <PillButton block>
              <Heart className="size-4" />
              Like
            </PillButton>

            <PillButton block variant="outline">
              <MessageCircle className="size-4" />
              Message
            </PillButton>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-sm font-semibold">
              About
            </h2>

            <p className="mt-3 leading-relaxed text-muted-foreground">
              {user.bio}
            </p>
          </div>

          <hr />

          <div className="my-5">
            <h2 className="text-sm font-semibold">
              Interests
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <Tag key={interest} active>
                  {interest}
                </Tag>
              ))}
            </div>
          </div>

          <hr />

          <div className="mt-5">
            <h2 className="text-sm font-semibold">
              Photos
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {user.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${user.name} photo ${index + 1}`}
                  className="aspect-[3/4] w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          </div>

          <hr className="my-5" />

          <div className="flex gap-2">
            <PillButton block variant="outline">
              <Flag className="size-4" />
              Report
            </PillButton>

            <PillButton block variant="outline">
              <Ban className="size-4" />
              Block
            </PillButton>
          </div>

        </section>

      </div>
    </div>
  )
}