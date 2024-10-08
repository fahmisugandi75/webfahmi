'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { KanbanBoard } from '@/components/kanban-board';

export default function ProjectPage() {
  const params = useParams();
  const projectId = (params?.id as string) || '';
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProjectDetails() {
      const { data, error } = await supabase
        .from('projects')
        .select('name, description')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project details:', error);
      } else if (data) {
        setProjectName(data.name);
        setProjectDescription(data.description);
      }
    }

    fetchProjectDetails();
  }, [projectId, supabase]);

  return (
    <div className="mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-6 mt-2">
        {projectName ? `${projectName} Tasks` : `Project ${projectId} Tasks`}
      </h1>
      {projectDescription && (
        <p className="text-gray-600 mb-4">{projectDescription}</p>
      )}
      <KanbanBoard projectId={projectId} />
    </div>
  );
}
