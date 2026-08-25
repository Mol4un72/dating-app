'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Field, Input, Select } from '@/components/field'
import { PillButton } from '@/components/pill-button'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const count = photos.filter(Boolean).length

  function addPhoto(index: number) {
    setSelectedIndex(index)
    fileInputRef.current?.click()
  }

  const schema = z.object({
    name: z
    .string()
    .min(2, 'Name is too short')
    .max(30, 'Name is too long')
    .regex(/^[A-Za-z]+$/, 'Name can contain only letters'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(8, 'The passwords do not match.'),
    birthday: z.string().min(1, "Please enter your birthday").refine((value) => {
      const date = new Date(value)
      const year = date.getFullYear()
      const currentYear = new Date().getFullYear()
      return year >= currentYear - 100 && year <= currentYear - 18
    }, 'You must be at least 18 years old'),
    gender: z.enum(['Woman', 'Man'], 'Please select your gender')
  }).refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
    setStep(2)
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
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-4"
            >
              <Field label="Name" htmlFor="name">
                <Input id="name" placeholder="Your first name" {...register('name')} />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Password" htmlFor="password">
                  <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                </Field>
                <Field label="Confirm" htmlFor="confirm">
                  <Input id="confirm" type="password" placeholder="••••••••" {...register('confirm')} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Birthday" htmlFor="birthday">
                  <Input id="birthday" type="date" {...register('birthday')} />
                </Field>
                <Field label="Gender" htmlFor="gender">
                  <Select id="gender" defaultValue="" {...register('gender')}>
                    <option value="" disabled>
                      Select
                    </option>
                    <option>Woman</option>
                    <option>Man</option>

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
              <input
                    type='file'
                    accept='image/*'
                    hidden
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0]

                      if (!file || selectedIndex === null) return

                      const url = URL.createObjectURL(file)

                      setPhotos((prev) => {
                        const next = [...prev]
                        next[selectedIndex] = url
                        return next
                      })
                    }}
                  >
                </input>
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
                    <img src={photo} alt={`Upload ${i + 1}`} className="size-full object-cover" />
                  ) : (
                    <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Plus className="size-4" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <PillButton
              size="lg"
              block
              className="mt-8"
              onClick={() => {
                if (count < 1) return
                else router.push('/discover')
              }}
            >
              Create account
            </PillButton>
          </>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
