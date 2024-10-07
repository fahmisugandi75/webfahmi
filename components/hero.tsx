import Link from 'next/link'
import GridPattern from '@/components/ui/animated-grid-pattern'
import Announcement from '@/components/announcement-tag'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import CalendarBook from './calendar-book'
import IconCloud from '@/components/ui/icon-cloud'
import { BoxReveal } from '@/components/ui/box-reveal'

export default function Hero() {
  return (
    <div className="relative bg-white min-h-screen overflow-hidden pt-12 sm:pt-0">
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
            <div className="lg:w-1/2 text-center lg:text-left mb-16 lg:-mb-16">
              <div className="flex justify-center lg:justify-start">
                <Announcement />
              </div>
              <BoxReveal>
                <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl my-2">
                  Senior UX/UI designer for hire!
                </h1>
              </BoxReveal>
              <BoxReveal>
                <p className="lg:mt-8 mt-2 text-base sm:text-lg leading-7 text-gray-600">
                  Fahmi is a seasoned expert in graphic design, UI/UX, and web development (WordPress, PHP, NextJs), with over 10 years of experience for international clients across consulting, banking, healthcare, wellness, and tech industries.
                </p>
              </BoxReveal>
              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-y-4 sm:gap-x-6 w-full">
                <div className="w-full sm:w-auto">
                  <div className="w-full h-full">
                    <CalendarBook />
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <Link href="https://yfxskljlopmcwmghykcl.supabase.co/storage/v1/object/public/avatars/Fahmi%20-%20Senior%20Graphic%20&%20Web%20Designer%20-%20copy.pdf" target="_blank" className="block w-full">
                    <Button variant="outline">
                      Download CV
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 mt-6 lg:mt-0 flex justify-center flex-col">
            <div className="-mb-24">
                <IconCloud iconSlugs={['react', 'nextjs', 'typescript', 'tailwindcss', 'figma', 'adobephotoshop', 'wordpress', 'adobeillustrator', 'html5', 'css3', 'supabase', 'github', 'elementor', 'adobeindesign', 'amazonaws', 'cpanel', 'nginx']} />
              </div> 
              <Image
                src="https://yfxskljlopmcwmghykcl.supabase.co/storage/v1/object/public/avatars/84b3ff40-57d8-40fa-9708-539e129a3f57-0.6619754556250563.png"
                alt="Fahmi - Senior Website Designer"
                width={1000}
                height={1000}
                className="-mr-96 -mt-72 z-10"
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}