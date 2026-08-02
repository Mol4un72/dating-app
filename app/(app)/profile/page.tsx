'use client'

import { useState } from 'react'
import {
  MapPin,
  Pencil,
  Settings,
  Ruler,
  Users,
} from 'lucide-react'
import { AppTopBar } from '@/components/app-topbar'
import { Avatar } from '@/components/avatar'
import { Tag, VerifiedBadge } from '@/components/tag'
import { PillButton } from '@/components/pill-button'
import { Modal } from '@/components/modal'
import { Field, Input } from '@/components/field'
import { currentUser, Interests } from '@/lib/data'

export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false)
  const [interestsOpen, setInterOpen] = useState(false)
  const [preferencesOpen, setPrefOpen] = useState(false)
  const [photosOpen, setPhotosOpen] = useState(false)

  const [name, setName] = useState(currentUser.name)
  const [location, setLocation] = useState(currentUser.location)
  const [bio, setBio] = useState(currentUser.bio)

  const [interests, setInterests] = useState(currentUser.interests)

  const [preferences, setPreferences] = useState(currentUser.preferences)
  const [ageRange, setAgeRange] = useState(currentUser.preferences.ageRange)
  const [distance, setDistance] = useState(currentUser.preferences.distance)
  const [photos, setPhotos] = useState([...currentUser.photos])


  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    )
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  function addPhoto() {
    setPhotos((prev) => [
      ...prev,
      '/placeholder.svg',
    ])
  }
  
  return (
    <>
      <AppTopBar
        title="Profile"
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          {/* Left: identity + info */}
          <div className="flex flex-col gap-6">
            <section className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
              <Avatar src={currentUser.photo} alt={currentUser.name} size="xl" ring />
              <div className="mt-4 flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {name}, {currentUser.age}
                </h1>
                {currentUser.verified && <VerifiedBadge />}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {location}
              </p>
              <div className="mt-5 flex w-full gap-2">
                <PillButton block onClick={() => setEditOpen(true)}>
                  <Pencil className="size-4" /> Edit profile
                </PillButton>
                <PillButton variant="outline" className="shrink-0" aria-label="Settings" href="profile/settings">
                  <Settings className="size-4" />
                </PillButton>
              </div>
            </section>
          </div>

          {/* Right: about + interests + gallery */}
          <div className="flex flex-col gap-6">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">

              <div className='mt-1 mb-5'>
                <h2 className="text-sm font-semibold text-foreground">About me</h2>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                  {bio}
                </p>
              </div>

              <hr />
              
              <div className='my-5'>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Interests</h2>
                  <button onClick={() => setInterOpen(true)} className="text-sm font-medium text-primary hover:underline">Manage</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Tag key={interest} active>
                      {interest}
                    </Tag>
                  ))}
                </div>
              </div>

              <hr />

              <div className='my-5'>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
                  <button onClick={() => setPrefOpen(true)} className="text-sm font-medium text-primary hover:underline">Manage</button>
                </div>
                <ul className="mt-4 flex flex-col gap-4">
                  <PreferenceRow icon={Users} label="Interested in" value={preferences.interestedIn} />
                  <PreferenceRow icon={Ruler} label="Age range" value={ageRange} />
                  <PreferenceRow icon={MapPin} label="Distance" value={distance === '51' ? 'Any distance' : `${distance} km`} />
                </ul>
              </div>

              <hr />

              <div className='mt-5 mb-1'>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Photos</h2>
                  <button onClick={() => setPhotosOpen(true)} className="text-sm font-medium text-primary hover:underline">Manage</button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {currentUser.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo || '/placeholder.svg'}
                      alt={`Photo ${i + 1}`}
                      className="aspect-[3/4] w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit profile"
        description="Update how you appear to others."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setEditOpen(false)
          }}
          className="flex flex-col gap-4"
        >
          <Field label="Name" htmlFor="edit-name">
            <Input onChange={(e) => setName(e.target.value)} id="edit-name" defaultValue={name} />
          </Field>
          <Field label="Location" htmlFor="edit-location">
            <Input onChange={(e) => setLocation(e.target.value)} id="edit-location" defaultValue={location} />
          </Field>
          <Field label="About me" htmlFor="edit-bio">
            <textarea
              id="edit-bio"
              defaultValue={bio}
              rows={4}
              className="w-full rounded-xl border border-border bg-card p-4 text-[0.95rem] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15 resize-none"
              onChange={(e) => setBio(e.target.value)}
            />
          </Field>
          <PillButton type="submit" block size="lg" className="mt-1">
            Save changes
          </PillButton>
        </form>
      </Modal>

      <Modal
        open={interestsOpen}
        onOpenChange={setInterOpen}
        title="Interests"
        description='Select the interests that describe you.'
      >
        <div className="mt-3 flex flex-wrap gap-2">
          {Interests.map((interest) => (
            <Tag 
              key={interest}
              active={interests.includes(interest)}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Tag>
          ))}
        </div>
      </Modal>

     <Modal
        open={preferencesOpen}
        onOpenChange={setPrefOpen}
        title="Preferences"
        description="Choose what you're looking for."
      >
        <div className="flex flex-col gap-6">

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Interested in
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {['Men', 'Women', 'Everyone'].map((item) => (
                <Tag
                  key={item}
                  active={preferences.interestedIn === item}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      interestedIn: item,
                    }))
                  }
                >
                  {item}
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Age range
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                '18 – 25',
                '25 – 35',
                '35 – 45',
                '45+',
              ].map((item) => (
                <Tag
                  key={item}
                  active={ageRange === item}
                  onClick={() => setAgeRange(item)}
                >
                  {item}
                </Tag>
              ))}
            </div>
          </div>
            
            
          {/* Distance */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Distance
            </h3>

            <div className="mt-2">
              <input
                type="range"
                min={'0'}
                max={'51'}
                value={distance}
                onChange={(e) => setDistance(String(e.target.value))}
                className="w-full"
              />

              <div className="mt-3 text-center text-sm font-medium text-foreground">
                {distance === '51' ? 'Any distance' : `${distance} km`}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={photosOpen}
        onOpenChange={setPhotosOpen}
        title="Photos"
        description="Manage your profile photos."
      >
      <div className="flex flex-col gap-5">

        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <button
                onClick={() => removePhoto(index)}
                className="
                  absolute right-2 top-2 
                  grid size-7 place-items-center
                  rounded-full 
                  bg-black/50 
                  text-white
                  opacity-0
                  transition-opacity
                  group-hover:opacity-100
                "
              >
                ×
              </button>
            </div>
          ))}

          {photos.length < 3 && (
            <button
              onClick={addPhoto}
              className="
                aspect-[3/4]
                rounded-2xl
                border-2
                border-dashed
                border-border
                text-2xl
                text-muted-foreground
                transition-colors
                hover:border-primary
                hover:text-primary
              "
            >
              +
            </button>
          )}

        </div>

        <PillButton
          block
          size="lg"
          onClick={() => setPhotosOpen(false)}
        >
          Save photos
        </PillButton>

        </div>
      </Modal>

    </>
  )
}

function PreferenceRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-primary">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-1 items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </li>
  )
}

