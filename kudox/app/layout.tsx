import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
})

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

export const metadata: Metadata = {
  title: 'KudoX — AI-Powered Meal Decisions',
  description: 'An AI-powered eating decision and recipe assistant.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${spaceGrotesk.variable} ${geist.variable}`}>{children}</body>
    </html>
  )
}