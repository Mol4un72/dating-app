import { SiteHeader } from '@/components/marketing/site-header'
import { Hero } from '@/components/marketing/hero'
import { Features } from '@/components/marketing/features'
import { Testimonials } from '@/components/marketing/testimonials'
import { SiteFooter } from '@/components/marketing/site-footer'

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <SiteFooter />
    </div>
  )
}
