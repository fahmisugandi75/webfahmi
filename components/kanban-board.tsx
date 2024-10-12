"use client";

import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import { TaskCard } from './TaskCard';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Task } from '../types/types';
import { useUserSession } from '@/hooks/useUserSession';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CreateTaskForm from './CreateTaskForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const columns = ['waiting', 'in-progress', 'in-review', 'completed'];

const sortTasksByDueDate = (tasks: Task[]) => {
  return tasks.sort((a, b) => {
    if (a.completed_at && !b.completed_at) return 1;
    if (!a.completed_at && b.completed_at) return -1;
    if (a.completed_at && b.completed_at) return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
};

export function KanbanBoard({ projectId }: { projectId: string }) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: userSession, isLoading: isUserLoading } = useUserSession();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchTasks = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });
    if (error) throw error;
    return data;
  };

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn: fetchTasks,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Partial<Task>) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', updatedTask.id)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  // Add this mutation for deleting tasks
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const onDragStart = (start: any) => {
    setDraggingTaskId(start.draggableId);
  };

  const onDragEnd = async (result: any) => { 
    setDraggingTaskId(null);
    const { source, destination, draggableId } = result;

    if (!destination || isUserLoading || !userSession || !tasks) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const movedTask = tasks.find(task => task.id.toString() === draggableId);
    if (!movedTask) return;

    const now = new Date().toISOString();
    const updatedTask = {
      ...movedTask,
      status: destination.droppableId,
      updated_by: userSession.userId,
      updated_at: now,
      completed_at: destination.droppableId === 'completed' ? now : null
    };

    // Optimistically update the local state
    queryClient.setQueryData(['tasks', projectId], (oldTasks: Task[] | undefined) => {
      if (!oldTasks) return [];
      return sortTasksByDueDate(oldTasks.map(task => 
        task.id === updatedTask.id ? updatedTask as Task : task
      ));
    });

    try {
      await updateTaskMutation.mutateAsync(updatedTask as Partial<Task>);
      toast({
        title: "Success",
        description: updatedTask.completed_at 
          ? "Task marked as completed" 
          : "Task updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert the optimistic update
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sortedTasks = React.useMemo(() => {
    if (!tasks) return {};
    return columns.reduce((acc, column) => {
      acc[column] = sortTasksByDueDate(tasks.filter(task => task.status === column));
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const handleCreateTask = (newTask: Task) => {
    queryClient.setQueryData(['tasks', projectId], (oldTasks: Task[] | undefined) => {
      if (!oldTasks) return [newTask];
      return sortTasksByDueDate([...oldTasks, newTask]);
    });
    setIsSheetOpen(false);
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="mx-auto p-0">
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex flex-wrap -mx-2">
          {columns.map((column) => (
            <div key={column} className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
              <Card className="bg-gray-50 dark:bg-gray-900">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold capitalize">{column}</h3>
                    <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded-sm px-2 py-0.5 min-w-[1.5rem] text-center">
                      {sortedTasks[column]?.length || 0}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <StrictModeDroppable droppableId={column}>
                    {(provided: any, snapshot: any) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[2px] ${
                          snapshot.isDraggingOver ? 'bg-blue-100 dark:bg-blue-900' : ''
                        }`}
                      >
                        {sortedTasks[column]?.map((task, index) => (
                          <TaskCard 
                            key={task.id} 
                            task={task} 
                            index={index} 
                            onTaskUpdate={updateTaskMutation.mutate} 
                            onTaskDelete={handleDeleteTask} // Pass the delete function here
                            isDragging={draggingTaskId === task.id.toString()}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </StrictModeDroppable>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
