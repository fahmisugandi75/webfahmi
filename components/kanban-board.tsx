"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable'; // Import the new component
import { TaskCard } from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react'; // Import the icon
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/types'; // Add this import

interface KanbanBoardProps {
  projectId: string;
}

const columns = ['waiting', 'in-progress', 'in-review', 'completed'];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('order', { ascending: true }); // Sort by order

      if (error) throw error;

      // Ensure all tasks have the required fields
      const validTasks = (data || []).filter(task => 
        task.id && task.status &&
        task.order !== undefined &&
        task.project_id &&
        task.title &&
        task.description &&
        task.priority
      );

      setTasks(validTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreate = async (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsDialogOpen(false); // Close the dialog after creating a task
  };

  const onDragStart = (start: any) => {
    setDraggingTaskId(start.draggableId);
    setDraggingColumnId(start.source.droppableId);
  };

  const onDragEnd = async (result: any) => { 
    setDraggingTaskId(null);
    setDraggingColumnId(null);
    const { source, destination, draggableId } = result;

    // If there's no destination, we don't need to do anything
    if (!destination) return;

    // If the item is dropped in the same position, we don't need to do anything
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Create a new array of tasks
    let newTasks = Array.from(tasks);

    // Find the moved task
    const movedTask = newTasks.find(task => task.id.toString() === draggableId);
    if (!movedTask) return;

    // Remove the task from its original position
    newTasks = newTasks.filter(task => task.id !== movedTask.id);

    // Update the moved task's status and order
    movedTask.status = destination.droppableId;
    movedTask.order = destination.index;

    // Insert the task at the new position
    newTasks.splice(destination.index, 0, movedTask);

    // Update the order of tasks in both the source and destination columns
    newTasks = newTasks.map((task, index) => ({
      ...task,
      order: task.status === source.droppableId || task.status === destination.droppableId
        ? newTasks.filter(t => t.status === task.status).indexOf(task)
        : task.order
    }));

    // Update the state
    setTasks(newTasks);

    // Update the database
    const supabase = createClient();
    try {
      const updatedTasks = newTasks.map(({ id, status, order, project_id, title, description, priority }) => ({ 
        id, 
        status, 
        order, 
        project_id,
        title,
        description,
        priority
      }));
      console.log('Updating tasks:', updatedTasks);

      // Fetch the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Add the user_id to each task update
      const tasksWithUserId = updatedTasks.map(task => ({
        ...task,
        user_id: user.id
      }));

      const { data, error } = await supabase
        .from('tasks')
        .upsert(tasksWithUserId)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Updated tasks:', data);

      toast({
        title: "Success",
        description: "Task order updated successfully",
      });
    } catch (error) {
      console.error('Error updating task order:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      toast({
        title: "Error",
        description: "Failed to update task order. Please try again.",
        variant: "destructive",
      });
      // Revert the state if the database update fails
      setTasks(tasks);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = async (taskId: string) => {
    const supabase = createClient();
    try {
      // Delete the task from the database
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      // If deletion was successful, update the local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTaskCountForColumn = (column: string) => {
    return tasks.filter(task => task.status === column).length;
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
                      {getTaskCountForColumn(column)}
                    </span>
                  </div>
                </CardHeader>
                {column === 'waiting' && (
                  <CardContent className="pt-0 pb-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Task</DialogTitle>
                        </DialogHeader>
                        <CreateTaskForm
                          projectId={projectId}
                          onSubmit={handleTaskCreate}
                          onCancel={() => setIsDialogOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                )}
                <CardContent>
                  <StrictModeDroppable droppableId={column}>
                    {(provided: any, snapshot: any) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[2px] ${
                          draggingColumnId === column ? 'border-2 border-dashed border-gray-300 rounded-lg' : ''
                        }`}
                      >
                        {tasks
                          .filter((task) => task.status === column)
                          .map((task, index) => (
                            <TaskCard 
                              key={task.id} 
                              task={task} 
                              index={index} 
                              onTaskUpdate={handleTaskUpdate} 
                              onTaskDelete={handleTaskDelete}
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