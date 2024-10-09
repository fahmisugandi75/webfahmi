'use client'

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { CalendarIcon, AlertCircle, PencilIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditTaskForm } from './EditTaskForm';
import { useToast } from "@/hooks/use-toast";
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onTaskUpdate, onTaskDelete }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    onTaskDelete(task.id);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted.",
    });
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided: any, snapshot: any) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3 last:mb-0"
        >
          <Card
            className={`bg-white p-4 ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'} hover:shadow-md transition-shadow duration-200 relative`}
          >
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">{task.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)} flex-shrink-0`}>
                  {task.priority}
                </span>
              </div>
              
              {task?.featured_image ? (
                <div className="relative w-full h-24">
                  <Image 
                    src={task.featured_image} 
                    alt={task.title} 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    onError={(e) => {
                      console.error('Image failed to load:', task.featured_image);
                      // @ts-ignore
                      e.target.onerror = null; // Prevent infinite loop
                      // @ts-ignore
                      e.target.src = '/placeholder.jpg'; // Replace with an actual placeholder image path
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              
              <p className="text-xs text-gray-600 line-clamp-3">{task.description}</p>
              
              {task.due_date && (
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                </div>
              )}
              
              {isOverdue(task.due_date) && (
                <div className="flex items-center text-xs text-red-500">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  <span>Overdue</span>
                </div>
              )}
              
              {/* Edit and Delete buttons */}
              <div className="absolute bottom-2 right-2 flex space-x-1">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <EditTaskForm 
                      task={task} 
                      onSubmit={(updatedTask) => {
                        onTaskUpdate(updatedTask);
                        setIsEditDialogOpen(false);
                      }} 
                      onCancel={() => setIsEditDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Task</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function isOverdue(due_date?: string): boolean {
  if (!due_date) return false;
  return new Date(due_date) < new Date();
}