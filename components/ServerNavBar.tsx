import { cookies } from 'next/headers';
import { ClientNavBar } from './ClientNavBar';

export function ServerNavBar() {
  const cookieStore = cookies();
  const hasEnvVars = !!cookieStore.get('hasEnvVars');

  return <ClientNavBar hasEnvVars={hasEnvVars} />;
}