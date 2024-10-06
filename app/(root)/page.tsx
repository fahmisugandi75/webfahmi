'use client'

import FeaturedSection from '@/components/featured-section'
import Hero from '@/components/hero'

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <FeaturedSection />
    </div>
  )
}
