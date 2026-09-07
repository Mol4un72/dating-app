'use client'

import { useState, useRef, useEffect} from 'react'
import { MapPin, Pencil, Settings, Ruler, Users, } from 'lucide-react'
import { AppTopBar } from '@/components/app-topbar'
import { Avatar } from '@/components/avatar'
import { Tag, VerifiedBadge } from '@/components/tag'
import { PillButton } from '@/components/pill-button'
import { Modal } from '@/components/modal'
import { Field, Input } from '@/components/field'
import type { Me, Draft } from "@/types/me"
import { Interests } from '@/types/interests'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFilters } from '@/context/filters-context'

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

  const [profile, setProfile] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)

  const [draft, setDraft] = useState<Draft | null>(null)

  const photoInputRef = useRef<HTMLInputElement | null>(null)

  const schema = z.object({
    name: z.string().min(2, 'Minimum 2 symbols'),
    location: z.string().min(4, 'Minimum 4 symbols'),
    bio: z
      .string()
      .min(20, 'Minimum 20 symbols')
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      location: '',
      bio: '',
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState:{errors}
  }=form

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/me')
      
        if (!response.ok) {
          throw new Error(`Failed to load profile: ${response.status}`)
        }
      
        const data: Me = await response.json()

        console.log('PROFILE FROM API:', data)

        setProfile(data)

        reset({
          name: data.name ?? '',
          location: data.location ?? '',
          bio: data.bio ?? '',
        })

        reset({
          name: data.name ?? '',
          location: data.location ?? '',
          bio: data.bio ?? '',
        })
      } catch (error) {
        console.error('PROFILE LOAD ERROR:', error)
      } finally {
        setLoading(false)
      }
    }
  
    loadProfile()
  }, [reset])

  const onSubmit = async (
    data: z.infer<typeof schema>
  ) => {
    try {
      const response = await fetch('/api/me', {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedProfile: Me =
        await response.json()

      setProfile(updatedProfile)

      setOpenModal(null)
    } catch (error) {
      console.error(
        'PROFILE UPDATE ERROR:',
        error
      )
    }
  }

  function toggleInterest(interest: string) {
    setDraft((prev) => {
      if (!prev) return prev
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

  async function removePhoto(index: number) {
    if (!draft) return

    if (draft.photos.length === 1) {
      setError((e) => ({
        ...e,
        photos: true,
      }))

      return
    }

    const photo = draft.photos[index]

    if (!photo) return

    try {
      const response = await fetch(
        '/api/me/photos',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: photo.id,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to delete photo'
        )
      }

      setDraft((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          photos: prev.photos.filter(
            (_, i) => i !== index
          ),
        }
      })

      setError((e) => ({
        ...e,
        photos: false,
      }))
    } catch (error) {
      console.error(
        'PHOTO DELETE ERROR:',
        error
      )
    }
  }

  async function addPhoto(file: File) {
    try {
      const formData = new FormData()

      formData.append('file', file)

      const response = await fetch(
        '/api/me/photos',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to upload photo'
        )
      }

      setDraft((prev) => {
        if (!prev) return prev

        return {
          ...prev,

          photos: [
            ...prev.photos,
            {
              id: data.id,
              url: data.url,
            },
          ],
        }
      })
    } catch (error) {
      console.error(
        'PHOTO UPLOAD ERROR:',
        error
      )
    }
  }

  async function handlePhotoUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Max size 5MB')
      return
    }

    if (currentDraft.photos.length >= 3) {
      alert('Maximum 3 photos')
      return
    }

    await addPhoto(file)

    e.target.value = ''
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        Failed to load profile.
      </div>
    )
  }

  const currentDraft: Draft = draft ?? {
   ...profile,
   filters: {
     interestedIn: filters?.interestedIn ?? 'Everyone',
     ageRange: filters?.ageRange ?? '18 – 25',
     distance: filters?.distance ?? '51',
   },
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
              <Avatar  src={profile.photos[0]?.url ?? '/placeholder.svg'}  alt={profile.name ?? 'Profile'}  size="xl"  ring/>
              <div className="mt-4 flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">  {profile.name ?? 'Your name'}  {profile.age !== null ? `, ${profile.age}` : ''}</h1>
                {profile.verified && <VerifiedBadge />}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">  <MapPin className="size-4" />  {profile.location ?? 'Location not set'}</p>
              <div className="mt-5 flex w-full gap-2">
                <PillButton 
                  block 
                  onClick={() => {
                    reset({
                      name: profile.name ?? '',
                      location: profile.location ?? '',
                      bio: profile.bio ?? '',
                    })
                    setOpenModal('edit')
                  }}>
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
                    type="button"
                    onClick={() => {
                      setDraft({
                        ...profile,
                        filters,
                      })
                      setOpenModal('interests')}
                    } 
                    className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Manage</button>
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
                    type="button"
                    onClick={() => {
                      setDraft({
                        ...profile,
                        filters,
                      })
                    
                      setOpenModal('preferences')
                    }}
                    className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Manage</button>
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
                    type="button"
                    onClick={() => {
                      setDraft({
                        ...profile,
                        filters,
                      })
                      setOpenModal("photos")
                    }}
                    className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Manage</button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {profile.photos.map((photo, i) => (
                    <img
                      key={photo.id}
                      src={photo.url || '/placeholder.svg'}
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
                  {errors.name.message}
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
                {errors.location.message}
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
                {errors.bio.message}
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
            setDraft({
              ...profile,
              filters,
            })
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
              active={currentDraft.interests.includes(interest)}
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
          type="button"
          block
          size="lg"
          className="mt-5"
          onClick={async () => {
            try {
              const response = await fetch('/api/me', {
                method: 'PATCH',
              
                headers: {
                  'Content-Type': 'application/json',
                },
              
                body: JSON.stringify({
                  interests: currentDraft.interests,
                }),
              })
            
              if (!response.ok) {
                throw new Error(
                  'Failed to save interests'
                )
              }
            
              const updatedProfile: Me =
                await response.json()
            
              setProfile(updatedProfile)
            
              setError((prev) => ({
                ...prev,
                interests: false,
              }))
            
              setOpenModal(null)
            } catch (error) {
              console.error(
                'INTERESTS SAVE ERROR:',
                error
              )
            }
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
                  active={currentDraft.filters.interestedIn === item}
                  onClick={() =>
                    setDraft((prev) => {
                      if (!prev) return prev
                                        
                      return {
                        ...prev,
                        filters: {
                          ...prev.filters,
                          interestedIn: item,
                        },
                      }
                    })
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
                  active={currentDraft.filters.ageRange === item}
                  onClick={() =>
                    setDraft((prev) => {
                      if (!prev) return prev
                                        
                      return {
                        ...prev,
                        filters: {
                          ...prev.filters,
                          ageRange: item,
                        },
                      }
                    })
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
                value={currentDraft.filters.distance}
                onChange={(e) =>
                  setDraft((prev) => {
                    if (!prev) return prev
                  
                    return {
                      ...prev,
                      filters: {
                        ...prev.filters,
                        distance: e.target.value,
                      },
                    }
                  })
                }
                className="w-full"
              />

              <div className="mt-3 text-center text-sm font-medium text-foreground">
                {currentDraft.filters.distance === '51'
                  ? 'Any distance'
                  : `${currentDraft.filters.distance} km`}
              </div>
            </div>
          </div>
                
        </div>
                
        <PillButton
          type="button"
          block
          size="lg"
          className="mt-5"
          onClick={async () => {
            try {
              const response = await fetch('/api/me', {
                method: 'PATCH',
              
                headers: {
                  'Content-Type': 'application/json',
                },
              
                body: JSON.stringify({
                  filters: currentDraft.filters,
                }),
              })
            
              if (!response.ok) {
                throw new Error(
                  'Failed to save preferences'
                )
              }
            
              const updatedProfile: Me =
                await response.json()
            
              setProfile(updatedProfile)
            
              setFilters(currentDraft.filters)
            
              setOpenModal(null)
            } catch (error) {
              console.error(
                'PREFERENCES SAVE ERROR:',
                error
              )
            }
          }}
        >
          Save changes
        </PillButton>
      </Modal>

      <Modal
        open={openModal === "photos"}
        onOpenChange={(open) => {
          if (!open) {
            setDraft({
              ...profile,
              filters,
            })
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
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoUpload}
          />
          <div className="grid grid-cols-3 gap-3">
            {currentDraft.photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <img
                  src={photo.url}
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

            {currentDraft.photos.length < 3 && (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
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
              setProfile(currentDraft)
                      
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
