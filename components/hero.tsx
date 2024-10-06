import { RainbowButton } from '@/components/ui/rainbow-button'
import Link from 'next/link'
import GridPattern from '@/components/ui/animated-grid-pattern'
import LogoCloud from '@/components/logo-cloud'
import { BorderBeam } from '@/components/ui/border-beam'

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <GridPattern 
        className="absolute inset-0 z-0"
        width={60}
        height={60}
        strokeDasharray={2}
        numSquares={30}
        maxOpacity={0.2}
      />
      <div className="relative z-10 px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-24">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          <BorderBeam />
                Announcing our next round of funding.{' '}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Data to enrich your online business
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
              iste dolor cupiditate blanditiis ratione.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboards/home">
                <RainbowButton>
                  Get started
                </RainbowButton>
              </Link>
              <Link href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <LogoCloud />
    </div>
  )
}