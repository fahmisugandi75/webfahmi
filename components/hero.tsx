import Link from 'next/link'
import GridPattern from '@/components/ui/animated-grid-pattern'
import Announcement from '@/components/announcement-tag'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="relative bg-white min-h-screen flex items-center">
      <GridPattern 
        className="absolute inset-0 z-0"
        width={60}
        height={60}
        strokeDasharray={2}
        numSquares={30}
        maxOpacity={0.2}
      />
      <div className="relative z-10 w-full px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-12 sm:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-center lg:text-left">
            <Announcement />
              <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-7xl">
                Senior website designer for hire!
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Fahmi is a seasoned expert in graphic design, UI/UX, and web development (WordPress, PHP, NextJs), with over 10 years of experience.
              </p>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <Link href="/dashboards/home">
                  <Button className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download CV
                  </Button>
                </Link>
                <Link href="#" className="text-sm font-semibold leading-6 text-gray-900">
                  Schedule a meeting <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
              <Image
                src="https://yfxskljlopmcwmghykcl.supabase.co/storage/v1/object/public/avatars/84b3ff40-57d8-40fa-9708-539e129a3f57-0.6619754556250563.png"
                alt="Fahmi - Senior Website Designer"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}