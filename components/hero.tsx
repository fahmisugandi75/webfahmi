import Link from 'next/link'
import GridPattern from '@/components/ui/animated-grid-pattern'
import Announcement from '@/components/announcement-tag'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import CalendarBook from './calendar-book'

export default function Hero() {
  return (
    <div className="relative bg-white h-screen overflow-hidden">
      <GridPattern 
        className="absolute inset-0 z-0"
        width={60}
        height={60}
        strokeDasharray={2}
        numSquares={30}
        maxOpacity={0.2}
      />
      <div className="relative z-10 h-full flex items-center w-full px-6 lg:px-8">
        <div className="mx-auto max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-center lg:text-left">
              <Announcement />
              <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl my-2">
                Senior UX/UI designer for hire!
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-7 text-gray-600">
                Fahmi is a seasoned expert in graphic design, UI/UX, and web development (WordPress, PHP, NextJs), with over 10 years of experience.
              </p>
              <div className="mt-6 sm:mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <Link href="https://yfxskljlopmcwmghykcl.supabase.co/storage/v1/object/public/avatars/Fahmi%20-%20Senior%20Graphic%20&%20Web%20Designer%20-%20copy.pdf" target="_blank">
                  <Button>
                    Download CV
                  </Button>
                </Link>
                <CalendarBook />
              </div>
            </div>
            <div className="lg:w-1/2 mt-6 lg:mt-0 flex justify-center">
              <Image
                src="https://yfxskljlopmcwmghykcl.supabase.co/storage/v1/object/public/avatars/84b3ff40-57d8-40fa-9708-539e129a3f57-0.6619754556250563.png"
                alt="Fahmi - Senior Website Designer"
                width={600}
                height={600}
                className="-mr-32"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}