import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/' || path === '/sign-in' || path === '/sign-up' || path === '/reset-password'

  const token = request.cookies.get('token')?.value || ''

  if (isPublicPath && token && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard/home', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/reset-password',
  ]
}
