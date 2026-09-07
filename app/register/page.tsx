'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Field, Input, Select } from '@/components/field'
import { Tag } from '@/components/tag'
import { PillButton } from '@/components/pill-button'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { Interests } from '@/types/interests'

const schema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(30, 'Name is too long')
      .regex(/^[\p{L}\s'-]+$/u, 'Name can contain only letters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(8, 'Confirm password must be at least 8 characters'),
    birthday: z
      .string()
      .min(1, 'Please enter your birthday')
      .refine((value) => {
        const date = new Date(value)
        const year = date.getFullYear()
        const currentYear = new Date().getFullYear()
        return year >= currentYear - 100 && year <= currentYear - 18
      }, 'You must be at least 18 years old'),
    gender: z.enum(['Woman', 'Man'], {
      message: 'Please select your gender',
    }),
    location: z.string().min(4, 'Location must be at least 4 characters'),
    bio: z
      .string()
      .min(20, 'About me must be at least 20 characters')
      .max(300, 'About me must be at most 300 characters'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [interestsError, setInterestsError] = useState(false)
  const [photosError, setPhotosError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)

  const {
    register,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: '',
      birthday: '',
      gender: undefined,
      location: '',
      bio: '',
    },
  })

  const bioValue = watch('bio') || ''

  function triggerPhotoSelect(index: number) {
    setSelectedSlotIndex(index)
    fileInputRef.current?.click()
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || selectedSlotIndex === null) return

    if (!file.type.startsWith('image/')) {
      setPhotosError('Please select a valid image file (PNG, JPG, etc.)')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotosError('Maximum photo file size is 5MB')
      e.target.value = ''
      return
    }

    setPhotosError(null)
    setPhotos((prev) => {
      const next = [...prev]
      next[selectedSlotIndex] = file
      return next
    })

    e.target.value = ''
  }

  function removePhoto(index: number, e: React.MouseEvent) {
    e.stopPropagation()
    setPhotos((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) => {
      const exists = prev.includes(interest)
      const next = exists
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]

      if (next.length >= 3) {
        setInterestsError(false)
      }
      return next
    })
  }

  async function handleNextStep1() {
    setGeneralError(null)
    const isValid = await trigger([
      'name',
      'email',
      'password',
      'confirm',
      'birthday',
      'gender',
    ])
    if (isValid) {
      setStep(2)
    }
  }

  async function handleNextStep2() {
    setGeneralError(null)
    const isValid = await trigger(['location', 'bio'])
    if (isValid) {
      setStep(3)
    }
  }

  function handleNextStep3() {
    setGeneralError(null)
    if (selectedInterests.length < 3) {
      setInterestsError(true)
      return
    }
    setInterestsError(false)
    setStep(4)
  }

  async function handleFinalSubmit() {
    setGeneralError(null)

    if (selectedInterests.length < 3) {
      setInterestsError(true)
      setStep(3)
      return
    }

    const activePhotos = photos.filter((p): p is File => p !== null)
    if (activePhotos.length < 1) {
      setPhotosError('Please upload at least one photo for your profile.')
      return
    }

    const isValid = await trigger()
    if (!isValid) {
      if (
        errors.name ||
        errors.email ||
        errors.password ||
        errors.confirm ||
        errors.birthday ||
        errors.gender
      ) {
        setStep(1)
        return
      }
      if (errors.location || errors.bio) {
        setStep(2)
        return
      }
    }

    try {
      setIsSubmitting(true)
      setSubmitStatus('Creating account...')

      const data = getValues()

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          birthday: data.birthday,
          gender: data.gender,
          location: data.location,
          bio: data.bio,
          interests: selectedInterests,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setGeneralError(result.error || 'Registration failed. Please try again.')
        setIsSubmitting(false)
        return
      }

      setSubmitStatus('Logging in...')

      const loginResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (!loginResult || loginResult.error) {
        setGeneralError(
          'Account created, but automatic sign in failed. Please log in manually.',
        )
        setIsSubmitting(false)
        router.push('/login')
        return
      }

      setSubmitStatus('Uploading photos...')

      for (const file of activePhotos) {
        const formData = new FormData()
        formData.append('file', file)

        const photoResponse = await fetch('/api/me/photos', {
          method: 'POST',
          body: formData,
        })

        if (!photoResponse.ok) {
          const photoResult = await photoResponse.json()
          console.error('Photo upload warning:', photoResult.error)
        }
      }

      setSubmitStatus('Setting up profile...')
      router.push('/discover')
      router.refresh()
    } catch (error) {
      console.error('Registration failed:', error)
      setGeneralError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                s <= step ? 'bg-primary' : 'bg-border',
              )}
            />
          ))}
        </div>

        {generalError && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {generalError}
          </div>
        )}

        {/* STEP 1: Basic account info */}
        {step === 1 && (
          <>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
              Create account
            </h1>
            <p className="mt-2 text-muted-foreground">
              Step 1 of 4: Let’s start with the basics.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <Field label="Name" htmlFor="name">
                <Input
                  id="name"
                  placeholder="Your name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </Field>

              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Password" htmlFor="password">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </Field>

                <Field label="Confirm" htmlFor="confirm">
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirm')}
                  />
                  {errors.confirm && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                      {errors.confirm.message}
                    </p>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Birthday" htmlFor="birthday">
                  <Input
                    id="birthday"
                    type="date"
                    {...register('birthday')}
                  />
                  {errors.birthday && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                      {errors.birthday.message}
                    </p>
                  )}
                </Field>

                <Field label="Gender" htmlFor="gender">
                  <Select
                    id="gender"
                    defaultValue=""
                    {...register('gender')}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Woman">Woman</option>
                    <option value="Man">Man</option>
                  </Select>
                  {errors.gender && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                      {errors.gender.message}
                    </p>
                  )}
                </Field>
              </div>

              <PillButton
                type="button"
                size="lg"
                block
                className="mt-2"
                onClick={handleNextStep1}
              >
                Continue
              </PillButton>
            </div>
          </>
        )}

        {/* STEP 2: Location & Bio */}
        {step === 2 && (
          <>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back
            </button>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              About you
            </h1>
            <p className="mt-2 text-muted-foreground">
              Step 2 of 4: Tell us where you are and a bit about yourself.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              <Field label="Location" htmlFor="location">
                <Input
                  id="location"
                  placeholder="e.g. Kyiv, Ukraine"
                  {...register('location')}
                />
                {errors.location && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </Field>

              <Field
                label="About me"
                htmlFor="bio"
                hint={
                  <span
                    className={cn(
                      'text-xs',
                      bioValue.length < 20
                        ? 'text-muted-foreground'
                        : 'text-primary font-medium',
                    )}
                  >
                    {bioValue.length}/300
                  </span>
                }
              >
                <textarea
                  id="bio"
                  rows={4}
                  maxLength={300}
                  placeholder="Share what makes you unique, what you enjoy doing, and what kind of connections you are looking for..."
                  className="w-full resize-none rounded-xl border border-border bg-card p-4 text-[0.95rem] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
                  {...register('bio')}
                />
                {errors.bio ? (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.bio.message}
                  </p>
                ) : bioValue.length > 0 && bioValue.length < 20 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum 20 characters ({20 - bioValue.length} more needed)
                  </p>
                ) : null}
              </Field>

              <PillButton
                type="button"
                size="lg"
                block
                className="mt-2"
                onClick={handleNextStep2}
              >
                Continue
              </PillButton>
            </div>
          </>
        )}

        {/* STEP 3: Interests (Static selection) */}
        {step === 3 && (
          <>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back
            </button>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Your interests
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Step 3 of 4: Choose the passions and hobbies that define you.
                </p>
              </div>
            </div>

            <div className="mt-4 flex max-h-[340px] flex-wrap gap-2 overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-sm">
              {Interests.map((interest) => {
                const isSelected = selectedInterests.includes(interest)
                return (
                  <Tag
                    key={interest}
                    active={isSelected}
                    onClick={() => toggleInterest(interest)}
                    className="cursor-pointer select-none transition hover:scale-105"
                  >
                    {interest}
                  </Tag>
                )
              })}
            </div>

            {interestsError && (
              <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                Please select at least 3 interests to continue.
              </div>
            )}

            <PillButton
              type="button"
              size="lg"
              block
              className="mt-6"
              onClick={handleNextStep3}
            >
              Continue
            </PillButton>
          </>
        )}

        {/* STEP 4: Photos (Final Step) */}
        {step === 4 && (
          <>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep(3)}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              <ArrowLeft className="size-4" /> Back
            </button>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              Add your photos
            </h1>
            <p className="mt-2 text-muted-foreground">
              Step 4 of 4: Add at least one photo. Your first photo will be your main one.
            </p>

            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handlePhotoChange}
            />

            <div className="mt-8 grid grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => !isSubmitting && triggerPhotoSelect(i)}
                  className={cn(
                    'group relative flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-secondary/50 transition-colors hover:border-primary',
                    photo && 'border-solid border-transparent',
                    isSubmitting && 'pointer-events-none opacity-80',
                  )}
                >
                  {photo ? (
                    <>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${i + 1}`}
                        className="size-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => removePhoto(i, e)}
                        className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/60 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                        aria-label="Remove photo"
                      >
                        <X className="size-4" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Main
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center">
                      <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
                        <Plus className="size-4" />
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {i === 0 ? 'Main photo' : `Photo ${i + 1}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {photosError && (
              <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {photosError}
              </div>
            )}

            <PillButton
              size="lg"
              block
              className="mt-8"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {submitStatus || 'Creating account...'}
                </span>
              ) : (
                'Create account'
              )}
            </PillButton>
          </>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

