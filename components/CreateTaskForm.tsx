'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Edit } from 'lucide-react';
import { cn } from "@/lib/utils";
import { createClient } from '@/utils/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Task } from '@/types/types';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '@supabase/supabase-js';

const DEFAULT_TASK_STATUS = 'waiting';

interface CreateTaskFormProps {
  projectId: string;
  onCancel: () => void;
  onSubmit: (newTask: Task) => void; // Add this line
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ projectId, onCancel, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const tempUrl = URL.createObjectURL(file);
      setTempImageUrl(tempUrl);
    }
  };

  const createTaskMutation = useMutation(
    async (newTask: Omit<Task, 'id' | 'created_at'>) => {
      let imageUrl = null;

      if (featuredImage) {
        const fileExt = featuredImage.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, featuredImage, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const taskWithImage = { ...newTask, featured_image: imageUrl };
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskWithImage)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['tasks', projectId]);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
        onSubmit(data); // Call the onSubmit prop with the new task
        onCancel();
      },
      onError: (error) => {
        console.error('Error creating task:', error);
        toast({
          title: "Error",
          description: "Failed to create task. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a task.",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate({
      title,
      description,
      priority,
      due_date: dueDate?.toISOString(),
      user_id: user.id,
      project_id: projectId,
      status: DEFAULT_TASK_STATUS,
      order: 0,
      updated_by: user.id,
      // Remove the created_at field from here
    });
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="featuredImage" className="text-sm font-medium">Featured Image</label>
        <div className="relative w-full h-48 group">
          <div className="w-full h-48 overflow-hidden rounded-lg bg-gray-100">
            {tempImageUrl ? (
              <img 
                src={tempImageUrl} 
                alt="Featured Image" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
            onClick={handleImageClick}
          >
            <Edit className="text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
      <div>
        <Input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={createTaskMutation.isLoading}>
          {createTaskMutation.isLoading ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;