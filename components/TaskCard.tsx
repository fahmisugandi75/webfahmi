'use client'

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { CalendarIcon, AlertCircle, PencilIcon, TrashIcon } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
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
  isDragging: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onTaskUpdate, onTaskDelete, isDragging }) => {
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

  const getDueDateStatus = (dueDate: string | undefined) => {
    if (!dueDate) return { text: "Not set", color: "text-gray-500", isAlert: false };
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return { text: "Overdue", color: "text-red-500", isAlert: true };
    } else if (isToday(date)) {
      return { text: "Due Today", color: "text-orange-500", isAlert: true };
    } else {
      return { 
        text: format(date, 'MMM d, yyyy'), 
        color: "text-gray-500",
        isAlert: false
      };
    }
  };

  const dueDateStatus = getDueDateStatus(task.due_date);

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided: any, snapshot: any) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 last:mb-0 ${
            isDragging ? 'border-2 border-dashed border-gray-300 rounded-lg' : ''
          }`}
        >
          <Card
            className={`bg-white p-4 ${
              snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
            } hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">{task.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-sm font-medium ${getPriorityColor(task.priority)} flex-shrink-0`}>
                  {task.priority}
                </span>
              </div>
              
              {task.featured_image && task.featured_image.trim() !== '' && (
                <div className="relative w-full h-24">
                  <Image 
                    src={task.featured_image} 
                    alt={task.title} 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
              
              <p className="text-xs text-gray-600 line-clamp-3">{task.description}</p>
              
              <div className="pt-2"> {/* Added padding top here */}
                <div className={`flex items-center text-xs ${dueDateStatus.color}`}>
                  {dueDateStatus.isAlert ? (
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0 mt-[1px]" />
                  ) : (
                    <CalendarIcon className="w-4 h-4 mr-1 flex-shrink-0 mt-[1px]" />
                  )}
                  <span>{dueDateStatus.text}</span>
                </div>
              </div>
              
              {/* Edit and Delete buttons */}
              <div className="absolute bottom-2 right-2 flex space-x-1">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1"
                    >
                      <PencilIcon className="h-3 w-3" />
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
                      <TrashIcon className="h-3 w-3" />
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