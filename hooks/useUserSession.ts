import { useQuery } from 'react-query';
import { createClient } from '@/utils/supabase/client';

export function useUserSession() {
  const supabase = createClient();

  return useQuery('userSession', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', session.user.id)
      .single();

    return {
      userId: session.user.id,
      isAdmin: profile?.roles === 'admin',
      role: profile?.roles
    };
  }, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
}
