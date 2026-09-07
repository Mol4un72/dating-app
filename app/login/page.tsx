'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/auth/auth-layout'
import { SocialButtons } from '@/components/auth/social-buttons'
import { Field, Input } from '@/components/field'
import { PillButton } from '@/components/pill-button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()

  const schema = z.object({
    email: z.email(''),
    password: z.string().min(8, ''),
  })

  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: FormData) {
    console.log('SUBMIT START', data.email)
    
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
    
      console.log('SIGN IN RESULT:', result)
    
      if (result?.error) {
        console.error('LOGIN ERROR:', result.error)
        return
      }
    
      console.log('LOGIN SUCCESS')
    
      router.push('/discover')
      router.refresh()
    } catch (error) {
      console.error('LOGIN EXCEPTION:', error)
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Log in to keep the conversation going.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          </Field>
          <Field
            label="Password"
            htmlFor="password"
            hint={
              <Link href="#" className="text-sm font-medium text-primary hover:underline">
                Forgot?
              </Link>
            }
          >
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          </Field>
          <PillButton type="submit" size="lg" block className="mt-2">
            Log in
          </PillButton>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">OR CONTINUE WITH</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <SocialButtons />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don’t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
