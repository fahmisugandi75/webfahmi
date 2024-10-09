export interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    due_date?: string;
    featured_image?: string;
    user_id: string;
    project_id: string;
    status: string;
  }