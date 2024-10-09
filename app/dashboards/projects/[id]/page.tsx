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

  // Dummy data for demonstration
  const dueDate = '28 Feb 2023';
  const tags = ['Meetings', 'UI Design', 'Development', 'UX Research'];

  return (
    <div className="mx-auto">
      <div className="relative h-64 mb-8">
        <Image
          src="https://yfxskljlopmcwmghykcl.supabase.co/storage/v1/object/public/avatars/vivid-blurred-colorful-wallpaper-background.jpg"
          alt="Project cover"
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-100"
        />
        <div className="absolute inset-0 flex items-end px-12 py-10">
          <h1 className="text-4xl font-bold text-white">
            {projectName || `Project ${projectId}`}
          </h1>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-6 mb-4">
          <div className="flex items-center gap-1">
            {ownerAvatar && (
              <Image
                src={ownerAvatar}
                alt={`${ownerName}'s avatar`}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <span className="text-sm text-gray-500 mb-1">Owner</span>
              <p className="text-sm">{ownerName}</p>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500 mb-1">Due date</span>
            <p className="text-sm">{dueDate}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500 mb-1">Priority</span>
            <p className="bg-yellow-200 text-red-800 px-3 py-1 rounded-md text-xs font-medium">Medium</p>
          </div>
          <div>
            <span className="text-sm text-gray-500 mb-1">Tags</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <p key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-xs font-medium">
                  {tag}
                </p>
              ))}
            </div>
          </div>
        </div>
        {projectDescription && (
          <>
            <span className="text-sm text-gray-500 mb-1">Project Overview</span>
            <p className="text-sm">{projectDescription}</p>
          </>
        )}
      </div>

      <div>
        <KanbanBoard projectId={projectId} />
      </div>
    </div>
  );
}
