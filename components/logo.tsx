import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <div className="flex items-center">
      <Link href="/" className="w-20 h-20 overflow-hidden">
        <Image
          src="https://yfxskljlopmcwmghykcl.supabase.co/storage/v1/object/public/avatars/84b3ff40-57d8-40fa-9708-539e129a3f57-0.16728968089782348.png"
          alt="Logo"
          width={64}
          height={64}
          className="object-cover"
        />
      </Link>
    </div>
  )
}