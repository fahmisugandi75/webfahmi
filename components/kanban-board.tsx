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
import { Task } from '@/types/task'; // Add this import

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
        .eq('project_id', projectId);

      if (error) throw error;

      setTasks(data || []);
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

    // Find the task that was dragged
    const draggedTask = tasks.find(task => task.id === draggableId);

    if (!draggedTask) {
      console.error('Dragged task not found');
      return;
    }

    // Create a new array of tasks
    const newTasks = tasks.filter(task => task.id !== draggableId);

    // Update the status of the dragged task
    const updatedTask = { ...draggedTask, status: destination.droppableId };

    // Insert the updated task at the new position
    newTasks.splice(destination.index, 0, updatedTask);

    // Update the state
    setTasks(newTasks);

    // Update the database
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: updatedTask.status })
        .eq('id', updatedTask.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
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