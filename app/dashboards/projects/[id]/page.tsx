'use client';

import { useQuery } from 'react-query';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { KanbanBoard } from '@/components/kanban-board';
import Image from 'next/image';

export default function ProjectPage() {
  const params = useParams();
  const projectId = (params?.id as string) || '';
  const supabase = createClientComponentClient();

  const { data: projectData, isLoading: projectLoading } = useQuery(['project', projectId], async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('name, description, user_id')
      .eq('id', projectId)
      .single();
    if (error) throw error;
    return data;
  });

  const { data: profileData, isLoading: profileLoading } = useQuery(['profile', projectData?.user_id], async () => {
    if (!projectData?.user_id) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('fullname, avatar_url')
      .eq('id', projectData.user_id)
      .single();
    if (error) throw error;
    return data;
  }, {
    enabled: !!projectData?.user_id,
  });

  if (projectLoading || profileLoading) {
    return <div>Loading...</div>;
  }

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
          className="brightness-100 rounded-md"
        />
        <div className="absolute bottom-0 left-0 right-0 px-12 py-10 bg-gradient-to-t from-orange-400 to-transparent rounded-md">
          <h1 className="text-4xl font-bold text-white mb-4">
            {projectData?.name || `Project ${projectId}`}
          </h1>
          {projectData?.description && (
            <p className="text-md text-white">{projectData.description}</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-6 mb-4">
          <div className="flex items-center gap-2">
            {profileData?.avatar_url && (
              <Image
                src={profileData.avatar_url}
                alt={`${profileData.fullname}'s avatar`}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <span className="text-sm text-gray-500 mb-1">Owner</span>
              <p className="text-sm">{profileData?.fullname}</p>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500 mb-1">Due date</span>
            <p className="text-sm">{dueDate}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500 mb-1">Priority</span>
            <p className="bg-yellow-200 text-red-800 px-2 py-1 rounded-sm text-xs font-medium">Medium</p>
          </div>
          <div>
            <span className="text-sm text-gray-500 mb-1">Tags</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <p key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-sm text-xs font-medium">
                  {tag}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <KanbanBoard projectId={projectId} />
      </div>
    </div>
  );
}
