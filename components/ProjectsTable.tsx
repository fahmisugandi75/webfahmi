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
import CreateProjectForm from '@/components/createprojectform'; // You'll need to create this component
import { createClient } from '@/utils/supabase/client';
import { TrashIcon } from 'lucide-react';

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

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const projectsContext = useProjects();
  if (!projectsContext) {
    return (
      <ProjectProvider>
        <ProjectsTableContent initialProjects={projects} />
      </ProjectProvider>
    );
  }
  return <ProjectsTableContent initialProjects={projects} />;
}

function ProjectsTableContent({ initialProjects }: { initialProjects?: Project[] }) {
  const { projects, setProjects } = useProjects();
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectsAndProfiles() {
      try {
        if (initialProjects) {
          setProjects(initialProjects);
        } else {
          // Fetch projects if not provided
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (projectsError) throw projectsError;
          setProjects(projectsData);
        }

        // Fetch profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('Profiles')
          .select('id, avatar_url, fullname');

        if (profilesError) throw profilesError;

        // Create a map of profiles
        const profilesMap = Object.fromEntries(
          profilesData.map((profile) => [profile.id, profile])
        );

        // Update the context state with fetched projects
        setProfiles(profilesMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setLoading(false);
      }
    }

    fetchProjectsAndProfiles();
  }, [setProjects, initialProjects]);

  const handleViewTasks = (projectId: string) => {
    router.push(`/dashboards/projects/${projectId}`);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    const supabase = createClient();
    try {
      // Delete the project from the database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete);

      if (error) throw error;

      // If deletion was successful, update the local state
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectToDelete));

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleProjectCreate = async (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setIsDialogOpen(false); // Close the dialog after creating a project
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <CreateProjectForm
              onSubmit={handleProjectCreate}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[200px] font-semibold text-gray-600">Owner</TableHead>
              <TableHead className="font-semibold text-gray-600">Project Name</TableHead>
              <TableHead className="font-semibold text-gray-600">Description</TableHead>
              <TableHead className="font-semibold text-gray-600">Created At</TableHead>
              <TableHead className="w-[100px] font-semibold text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <TableRow 
                  key={project.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center space-x-3">
                      {profiles[project.user_id]?.avatar_url ? (
                        <Image
                          src={profiles[project.user_id].avatar_url!}
                          alt="User Avatar"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs font-medium">
                            {profiles[project.user_id]?.fullname?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {profiles[project.user_id]?.fullname || 'Unknown User'}
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
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
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