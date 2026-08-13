import { Task } from '../types/task';
import { getTaskStatus } from './dateUtils';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

// Simple counters over the given tasks (usually the full Redux list)
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  let completed = 0;
  let pending = 0;
  let overdue = 0;

  for (const task of tasks) {
    const status = getTaskStatus(task);
    if (status === 'completed') completed += 1;
    else if (status === 'overdue') overdue += 1;
    else pending += 1;
  }

  return { total: tasks.length, completed, pending, overdue };
};
