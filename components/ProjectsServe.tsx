import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { ProjectsTable } from '@/components/ProjectsTable';

export async function ProjectsServer() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return <div>Error loading projects. Please try again later.</div>;
  }

  return <ProjectsTable projects={projects || []} />;
}