import Hero from '@/components/hero'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior UX/UI Designer for Hire',
  description: 'Fahmi is a seasoned expert in graphic design, UI/UX, and web development (WordPress, PHP, NextJs), with over 10 years of experience for international clients across consulting, banking, healthcare, wellness, and tech industries.',
}

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
    </div>
  )
}
