import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lumi — Find meaningful connections',
  description:
    'Lumi is a premium dating app that helps you discover people, match, and start real conversations.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("light", "bg-background", jakarta.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
