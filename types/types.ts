export interface Profile {
    id: string;
    avatar_url: string | null;
    fullname: string;
  }

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
    order: number;
  }

  export interface Project {
    id: string;
    name: string;
    description: string;
    created_at: string;
    user_id: string;
  }

