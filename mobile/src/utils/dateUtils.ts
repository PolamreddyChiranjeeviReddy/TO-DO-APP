import { Task, TaskStatus } from '../types/task';

export const formatDate = (value: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
};

export const formatTime = (value: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (value: string | null): string => {
  if (!value) return '';
  const formatted = formatDate(value);
  const time = formatTime(value);
  return time ? `${formatted} ${time}` : formatted;
};

// Milliseconds remaining until a task's closest time (deadline preferred).
// Null when the task has no deadline or dateTime.
export const getRemainingMs = (task: Task): number | null => {
  const target = task.deadline || task.dateTime;
  if (!target) return null;
  const date = new Date(target);
  if (Number.isNaN(date.getTime())) return null;
  return date.getTime() - Date.now();
};

export const isOverdue = (task: Task): boolean => {
  if (task.completed) return false;
  const remaining = getRemainingMs(task);
  return remaining !== null && remaining < 0;
};

export const getTaskStatus = (task: Task): TaskStatus => {
  if (task.completed) return 'completed';
  if (isOverdue(task)) return 'overdue';
  return 'pending';
};
