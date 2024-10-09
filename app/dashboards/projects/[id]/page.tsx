'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { KanbanBoard } from '@/components/kanban-board';
import Image from 'next/image';

export default function ProjectPage() {
  const params = useParams();
  const projectId = (params?.id as string) || '';
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerAvatar, setOwnerAvatar] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProjectDetails() {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('name, description, user_id')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error fetching project details:', projectError);
        return;
      }

      if (projectData) {
        setProjectName(projectData.name);
        setProjectDescription(projectData.description);

        const { data: profileData, error: profileError } = await supabase
          .from('Profiles')
          .select('fullname, avatar_url')
          .eq('id', projectData.user_id)
          .single();

        if (profileError) {
          console.error('Error fetching profile details:', profileError);
        } else if (profileData) {
          setOwnerName(profileData.fullname);
          setOwnerAvatar(profileData.avatar_url);
        }
      }
    }

    fetchProjectDetails();
  }, [projectId, supabase]);

  return (
    <div className="mx-auto space-y-4">
      <div className="flex items-center justify-between mb-6 mt-2">
        <h1 className="text-3xl font-bold">
          {projectName ? `${projectName} Tasks` : `Project ${projectId} Tasks`}
        </h1>
        {ownerName && (
          <div className="flex items-center space-x-3">
            {ownerAvatar && (
              <Image
                src={ownerAvatar}
                alt={`${ownerName}'s avatar`}
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-xs text-gray-500">Project owner</p>
              <p className="font-semibold">{ownerName}</p>
            </div>
          </div>
        )}
      </div>
      {projectDescription && (
        <p className="text-gray-600 mb-4">{projectDescription}</p>
      )}
      <KanbanBoard projectId={projectId} />
    </div>
  );
}
