import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { FC } from 'react';

interface Project {
  // Define your project properties here
}

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable: FC<ProjectsTableProps> = ({ projects }) => {
  return (
    // ... existing ProjectsTable component JSX ...
  );
};

export default ProjectsTable;

export async function ProjectsServer() {
  const cookieStore = cookies();
  const supabase = createClient();

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