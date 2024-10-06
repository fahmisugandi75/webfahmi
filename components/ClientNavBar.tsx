'use client'

import { usePathname } from 'next/navigation';
import { NavBar } from './navbar';

export function ClientNavBar({ hasEnvVars }: { hasEnvVars: boolean }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return null;
  }

  return <NavBar hasEnvVars={hasEnvVars} />;
}