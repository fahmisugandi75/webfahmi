'use client'

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Project } from './ProjectsTable';

interface CreateProjectFormProps {
  onCancel: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const createProjectMutation = useMutation(
    async (newProject: Omit<Project, 'id' | 'created_at' | 'user_id'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .single();
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
        toast({
          title: "Success",
          description: "Project created successfully",
        });
        onCancel();
      },
      onError: (error) => {
        console.error('Error creating project:', error);
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={createProjectMutation.isLoading}>
          {createProjectMutation.isLoading ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
