export type Priority = 'low' | 'medium' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
}
