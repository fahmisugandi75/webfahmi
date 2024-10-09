'use client'

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { CalendarIcon, AlertCircle, PencilIcon, TrashIcon, MoreVertical } from 'lucide-react';
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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

  const handleEditClick = () => {
    setIsPopoverOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsPopoverOpen(false);
    setIsDeleteDialogOpen(true);
  };

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
            } hover:shadow-md transition-shadow duration-200 relative`}
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
              
              {/* Due date and More options button */}
              <div className="flex justify-between items-center pt-0">
                <div className={`flex items-center text-xs ${dueDateStatus.color}`}>
                  {dueDateStatus.isAlert ? (
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  ) : (
                    <CalendarIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                  )}
                  <span>{dueDateStatus.text}</span>
                </div>
                
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-6"
                    >
                      <MoreVertical className="h-4 w-4 dark:text-gray-900" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-28 p-0">
                    <div className="flex flex-col">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start"
                        onClick={handleEditClick}
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start text-red-500 hover:text-red-700"
                        onClick={handleDeleteClick}
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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

          {/* Delete Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this task?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
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