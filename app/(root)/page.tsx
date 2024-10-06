'use client'

import FeaturedSection from '@/components/featured-section'
import Hero from '@/components/hero'
import BentoGrid from '@/components/bento-grid'
import LogoCloud from '@/components/logo-cloud'
import Testimonial from '@/components/testimonial'
import CTAForm from '@/components/cta-form'
import Pricing from '@/components/pricing'

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <LogoCloud />
      <BentoGrid />
      <FeaturedSection />
      <Testimonial />
      <Pricing /> 
    </div>
  )
}
