'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useProjects, ProjectProvider } from './ProjectContext';
import { Eye, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateProjectForm from '@/components/createprojectform';
import { createClient } from '@/utils/supabase/client';
import { TrashIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  user_id: string;
}

interface Profile {
  id: string;
  avatar_url: string | null;
  fullname: string;
}

interface ProjectsTableProps {
  projects?: Project[]; // Make projects optional
}

export function ProjectsTable({ projects: projectsList }: ProjectsTableProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);

  const { data: projectsData, isLoading, error } = useQuery('projects', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }, {
    initialData: projects,
  });

  const { data: profilesData } = useQuery('profiles', async () => {
    const { data, error } = await supabase
      .from('Profiles')
      .select('id, avatar_url, fullname');
    if (error) throw error;
    return Object.fromEntries(data.map((profile) => [profile.id, profile]));
  });

  const deleteProjectMutation = useMutation(
    async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
      },
      onError: (error) => {
        console.error('Error deleting project:', error);
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  const handleViewTasks = (projectId: string) => {
    router.push(`/dashboards/projects/${projectId}`);
  };

  const handleDeleteClick = (projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  };

  const handleProjectCreate = async (newProject: Project) => {
    setProjects((prevProjects: Project[]) => [...prevProjects, newProject]);
    setIsDialogOpen(false);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <CreateProjectForm onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 rounded-md border overflow-hidden">
              <TableHead className="w-[200px] font-semibold text-gray-600 py-3 px-4 first:rounded-tl-md last:rounded-tr-md">Owner</TableHead>
              <TableHead className="font-semibold text-gray-600 py-3 px-4">Project Name</TableHead>
              <TableHead className="font-semibold text-gray-600 py-3 px-4">Description</TableHead>
              <TableHead className="font-semibold text-gray-600 py-3 px-4">Created At</TableHead>
              <TableHead className="w-[100px] font-semibold text-gray-600 py-3 px-4 first:rounded-tl-md last:rounded-tr-md">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectsData && projectsData.length > 0 ? (
              projectsData.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center space-x-3">
                      {profilesData && profilesData[project.user_id]?.avatar_url ? (
                        <Image
                          src={profilesData[project.user_id].avatar_url!}
                          alt="User Avatar"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs font-medium">
                            {profilesData && profilesData[project.user_id]?.fullname?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {profilesData && profilesData[project.user_id]?.fullname || 'Unknown User'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{project.name || 'N/A'}</TableCell>
                  <TableCell className="text-gray-500 max-w-xs truncate">
                    {project.description || 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {project.created_at 
                      ? new Date(project.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 hover:bg-blue-50"
                        onClick={() => handleViewTasks(project.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClick(project.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Project</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this project? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDeleteClick(project.id)}>Delete</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}