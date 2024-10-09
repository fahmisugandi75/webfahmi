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
import { User } from '@supabase/supabase-js';
import { Task } from '@/types/task';

const DEFAULT_TASK_STATUS = 'waiting';

interface CreateTaskFormProps {
  projectId: string;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ projectId, onSubmit, onCancel }) => {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    }
    getUser();
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

    setIsLoading(true);
    const supabase = createClient();

    try {
      let imageUrl = null;

      if (featuredImage) {
        const fileExt = featuredImage.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, featuredImage, { upsert: true });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const newTask: Omit<Task, 'id'> = {
        title,
        description,
        priority,
        due_date: dueDate?.toISOString() ?? undefined,
        featured_image: imageUrl ?? undefined,
        user_id: user.id,
        project_id: projectId,
        status: DEFAULT_TASK_STATUS
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select() // Remove the '*, project:projects(image_url)' and just use select()
        .single();

      if (error) {
        throw new Error(`Task creation failed: ${error.message}`);
      }

      console.log('Inserted task:', data);

      onSubmit(data); // Pass the entire task data

      // Reset form fields
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(undefined);
      setFeaturedImage(null);
      setTempImageUrl(null);

      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });

      onCancel(); // Close the modal

    } catch (error) {
      console.error('Error in task creation process:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create task. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Task Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Task Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="priority" className="text-sm font-medium">Priority</label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;