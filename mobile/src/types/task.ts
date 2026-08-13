export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// Fixed set of categories offered in the task form
export const CATEGORIES = ['Personal', 'Work', 'Study', 'Other'] as const;

export type TaskStatus = 'pending' | 'completed' | 'overdue';

// Task shape as returned by the API (dates arrive as ISO strings)
export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dateTime: string | null;
  deadline: string | null;
  priority: Priority;
  category: string;
  tags: string[];
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dateTime?: string;
  deadline?: string;
  priority?: Priority;
  category?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dateTime?: string;
  deadline?: string;
  priority?: Priority;
  category?: string;
  tags?: string[];
  completed?: boolean;
}
