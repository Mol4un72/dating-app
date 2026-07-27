'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Plus } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Field, Input, Select } from '@/components/field'
import { PillButton } from '@/components/pill-button'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null])

  function addPhoto(index: number) {
    const samples = [
      '/people/ava.png',
      '/people/sophie.png',
      '/people/mia.png',
      '/people/noah.png',
    ]
    setPhotos((prev) => {
      const next = [...prev]
      next[index] = samples[index % samples.length]
      return next
    })
  }

  return (
    <AuthLayout>
      <div className="flex flex-col">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <span
              key={s}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                s <= step ? 'bg-primary' : 'bg-border',
              )}
            />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
              Create account
            </h1>
            <p className="mt-2 text-muted-foreground">Let’s start with the basics.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setStep(2)
              }}
              className="mt-8 flex flex-col gap-4"
            >
              <Field label="Name" htmlFor="name">
                <Input id="name" placeholder="Your first name" required />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input id="email" type="email" placeholder="you@example.com" required />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Password" htmlFor="password">
                  <Input id="password" type="password" placeholder="••••••••" required />
                </Field>
                <Field label="Confirm" htmlFor="confirm">
                  <Input id="confirm" type="password" placeholder="••••••••" required />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Birthday" htmlFor="birthday">
                  <Input id="birthday" type="date" required />
                </Field>
                <Field label="Gender" htmlFor="gender">
                  <Select id="gender" defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option>Woman</option>
                    <option>Man</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </Select>
                </Field>
              </div>
              <PillButton type="submit" size="lg" block className="mt-2">
                Continue
              </PillButton>
            </form>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Add your photos</h1>
            <p className="mt-2 text-muted-foreground">
              Add at least two. Your first photo will be your main one.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => addPhoto(i)}
                  className={cn(
                    'relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-secondary/50 transition-colors hover:border-primary',
                    photo && 'border-solid border-transparent',
                  )}
                >
                  {photo ? (
                    <img src={photo || "/placeholder.svg"} alt={`Upload ${i + 1}`} className="size-full object-cover" />
                  ) : (
                    <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Plus className="size-4" />
                    </span>
                  )}
                  {i === 0 && !photo && (
                    <Camera className="pointer-events-none absolute bottom-2 size-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>

            <PillButton
              size="lg"
              block
              className="mt-8"
              onClick={() => router.push('/discover')}
            >
              Create account
            </PillButton>
          </>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
