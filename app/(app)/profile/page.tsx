'use client'

import { useState } from 'react'
import { MapPin, Pencil, Settings, Ruler, Users, } from 'lucide-react'
import { AppTopBar } from '@/components/app-topbar'
import { Avatar } from '@/components/avatar'
import { Tag, VerifiedBadge } from '@/components/tag'
import { PillButton } from '@/components/pill-button'
import { Modal } from '@/components/modal'
import { Field, Input } from '@/components/field'
import { currentUser, Interests } from '@/lib/data'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFilters } from '@/context/filters-context'
import { filter } from 'framer-motion/client'

  type ModalType =
  | 'edit'
  | 'interests'
  | 'preferences'
  | 'photos'
  | null

  type ErrorType = {
    interests: boolean
    photos: boolean
  }

export default function ProfilePage() {

  const { filters, setFilters } = useFilters()

  const [openModal, setOpenModal] = useState<ModalType>(null)

  const [error, setError] = useState<ErrorType>({
    interests: false,
    photos: false,
  })

  const [profile, setProfile] = useState(currentUser)

  const [draft, setDraft] = useState(currentUser)

  const schema = z.object({
    name: z.string().min(2, 'Minimum 2 symbols'),

    location: z.string().min(4, 'Minimum 4 symbols'),

    bio: z
      .string()
      .min(20, 'Minimum 20 symbols')
      .max(140, 'Maximum 140 symbols'),
  })


  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name,
      location: profile.location,
      bio: profile.bio,
    },
  })

  const {
    register,
    handleSubmit,
    formState:{errors}
  }=form

  const onSubmit = (data: z.infer<typeof schema>) => {
    setProfile((prev) => ({
      ...prev,
      ...data,
    }))
  
    setOpenModal(null)
  }

  function toggleInterest(interest: string) {
    setDraft((prev) => {
      const isSelected = prev.interests.includes(interest)

      if (isSelected && prev.interests.length === 1) {
        setError({
          interests: true,
          photos: false,
        })

        return prev
      }

      setError({
        interests: false,
        photos: false,
      })

      return {
        ...prev,
        interests: isSelected
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
      }
    })
  }

  function removePhoto(index: number) {
    setDraft((prev) => {
      if (prev.photos.length === 1) {
        setError((e) => ({
          ...e,
          photos: true,
        }))

        return prev
      }

      setError((e) => ({
        ...e,
        photos: false,
      }))

      return {
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      }
    })
  }

  function addPhoto() {
    setDraft((prev) => ({
      ...prev,
      photos: [...prev.photos, "/placeholder.svg"],
    }))
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
              <Avatar src={profile.photo} alt={profile.name} size="xl" ring />
              <div className="mt-4 flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {profile.name}, {profile.age}
                </h1>
                {currentUser.verified && <VerifiedBadge />}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {profile.location}
              </p>
              <div className="mt-5 flex w-full gap-2">
                <PillButton block onClick={() => setOpenModal('edit')}>
                  <Pencil className="size-4" /> Edit profile
                </PillButton>
                <PillButton variant="outline" className="shrink-0" aria-label="Settings" href="/profile/settings">
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
                <p className="mt-3 break-all text-pretty leading-relaxed text-muted-foreground">
                  {profile.bio}
                </p>
              </div>

              <hr />
              
              <div className='my-5'>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Interests</h2>
                  <button 
                    onClick={() => {
                      setDraft(profile)
                      setOpenModal('interests')}
                    } 
                    className="text-sm font-medium text-primary hover:underline">Manage</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
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
                  <button 
                    onClick={() => {
                      setDraft(profile)
                      setOpenModal("preferences")
                    }}
                    className="text-sm font-medium text-primary hover:underline">Manage</button>
                </div>
                <ul className="mt-4 flex flex-col gap-4">
                  <PreferenceRow icon={Users} label="Interested in" value={filters.interestedIn} />
                  <PreferenceRow icon={Ruler} label="Age range" value={filters.ageRange} />
                  <PreferenceRow icon={MapPin} label="Distance" value={filters.distance === '51' ? 'Any distance' : `${filters.distance} km`} />
                </ul>
              </div>

              <hr />

              <div className='mt-5 mb-1'>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Photos</h2>
                  <button
                    onClick={() => {
                      setDraft(profile)
                      setOpenModal("photos")
                    }}
                    className="text-sm font-medium text-primary hover:underline">Manage</button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {profile.photos.map((photo, i) => (
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
        open={openModal === 'edit'}
        onOpenChange={(open) => {
          setOpenModal(open ? 'edit' : null)
        }}
        title="Edit profile"
        description="Update how you appear to others."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Field label="Name" htmlFor="edit-name">
            <Input
              id="edit-name"
              {...register("name")}
            />
              {errors.name?.message &&
                <p className="mt-2 text-sm font-medium text-red-600">
                  Minimum 2 symbols
                </p>
              }
          </Field>
          <Field label="Location" htmlFor="edit-location">
            <Input
              id="edit-location"
              {...register("location")}
            />
            {errors.location?.message &&
              <p className="mt-2 text-sm font-medium text-red-600">
                Minimum 4 symbols
              </p>
            }
          </Field>
          <Field label="About me" htmlFor="edit-bio">
            <textarea
              rows={4}
              maxLength={140}
              className="w-full rounded-xl border border-border bg-card p-4 text-[0.95rem] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15 resize-none"
              id="edit-bio"
              {...register("bio")}
            />
            {errors.bio?.message && (
              <p className="mt-2 text-sm font-medium text-red-600">
                Minimum 20 symbols
              </p>
            )}
          </Field>
          <PillButton 
            type="submit"
            block size="lg"
            className="mt-1"
          >
            Save changes
          </PillButton>
        </form>
      </Modal>

      <Modal
        open={openModal === 'interests'}
        onOpenChange={(open) => {
          if (!open) {
            setDraft(profile)
          }
        
          setOpenModal(open ? "interests" : null)
        }}
        title="Interests"
        description="Select the interests that describe you."
      >
        <div className="mt-3 flex flex-wrap gap-2">
          {Interests.map((interest) => (
            <Tag
              key={interest}
              active={draft.interests.includes(interest)}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Tag>
          ))}

          {error.interests && (
            <div className="mt-3 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              Please keep at least one interest selected.
            </div>
          )}
        </div>
        <PillButton 
            type="submit"
            block size="lg"
            className="mt-5"
            onClick={() => {
              setProfile(draft)

              setError((prev) => ({
                ...prev,
                interests: false
              }))
            
              setOpenModal(null)
            }}
          >
            Save changes
          </PillButton>
      </Modal>

      <Modal
        open={openModal === 'preferences'}
        onOpenChange={(open) => {
          setOpenModal(open ? "preferences" : null)
        }}
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
                  active={filters.interestedIn === item}
                  onClick={() =>
                    setFilters((prev) => ({
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
                  active={filters.ageRange === item}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      ageRange: item,
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
              Distance
            </h3>
            
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="51"
                value={filters.distance}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    distance: e.target.value,
                  }))
                }
                className="w-full"
              />

              <div className="mt-3 text-center text-sm font-medium text-foreground">
                {filters.distance === '51'
                  ? 'Any distance'
                  : `${filters.distance} km`}
              </div>
            </div>
          </div>
                
        </div>
                
        <PillButton
          block
          size="lg"
          className="mt-5"
          onClick={() => {
            setOpenModal(null)
          }}
        >
          Save changes
        </PillButton>
      </Modal>

      <Modal
        open={openModal === "photos"}
        onOpenChange={(open) => {
          if (!open) {
            setDraft(profile)
            setError((prev) => ({
              ...prev,
              photos: false,
            }))
          }
        
          setOpenModal(open ? "photos" : null)
        }}
        title="Photos"
        description="Manage your profile photos."
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {draft.photos.map((photo, index) => (
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
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/50 text-white"
                >
                  <span className="-translate-y-0.5">×</span>
                </button>
              </div>
            ))}

            {draft.photos.length < 3 && (
              <button
                type="button"
                onClick={addPhoto}
                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-border text-2xl text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                +
              </button>
            )}
          </div>
          
          {error.photos && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              Please keep at least one profile photo.
            </div>
          )}

          <PillButton
            block
            size="lg"
            onClick={() => {
              setProfile(draft)
                      
              setError((prev) => ({
                ...prev,
                photos: false,
              }))
            
              setOpenModal(null)
            }}
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

