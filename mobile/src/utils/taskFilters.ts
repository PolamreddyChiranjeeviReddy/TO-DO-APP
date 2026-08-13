import { Task, Priority } from '../types/task';
import { isOverdue } from './dateUtils';
import { sortTasksByUrgency } from './taskSorting';

export type TaskFilter =
  | 'all'
  | 'active'
  | 'completed'
  | 'overdue'
  | 'high'
  | 'medium'
  | 'low';

export type TaskSort = 'smart' | 'deadline' | 'priority' | 'newest' | 'oldest';

export const FILTER_OPTIONS: TaskFilter[] = [
  'all',
  'active',
  'completed',
  'overdue',
  'high',
  'medium',
  'low',
];

export const SORT_OPTIONS: TaskSort[] = [
  'smart',
  'deadline',
  'priority',
  'newest',
  'oldest',
];

const PRIORITY_WEIGHT: Record<Priority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

// Matches tasks whose title, description, category or tags contain the term
export const searchTasks = (tasks: Task[], term: string): Task[] => {
  const query = term.trim().toLowerCase();
  if (!query) return tasks;
  return tasks.filter(task => {
    const haystack = [
      task.title,
      task.description,
      task.category,
      ...task.tags,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });
};

// Filters tasks by the selected status/priority filter
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed && !isOverdue(task));
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'overdue':
      return tasks.filter(task => isOverdue(task));
    case 'high':
      return tasks.filter(task => task.priority === 'HIGH');
    case 'medium':
      return tasks.filter(task => task.priority === 'MEDIUM');
    case 'low':
      return tasks.filter(task => task.priority === 'LOW');
    default:
      return tasks; // 'all'
  }
};

// Tasks without a deadline always sort last for the deadline option
const deadlineMs = (task: Task): number =>
  task.deadline ? new Date(task.deadline).getTime() : Number.POSITIVE_INFINITY;

const createdAtMs = (task: Task): number => new Date(task.createdAt).getTime();

// Returns a new sorted array; never mutates the input
export const sortTasks = (tasks: Task[], sort: TaskSort): Task[] => {
  switch (sort) {
    case 'smart':
      return sortTasksByUrgency(tasks);
    case 'deadline':
      return [...tasks].sort((a, b) => deadlineMs(a) - deadlineMs(b));
    case 'priority':
      return [...tasks].sort(
        (a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
      );
    case 'oldest':
      return [...tasks].sort((a, b) => createdAtMs(a) - createdAtMs(b));
    default:
      return [...tasks].sort((a, b) => createdAtMs(b) - createdAtMs(a)); // 'newest'
  }
};

// Full pipeline: search → filter → sort → display
export const processTasks = (
  tasks: Task[],
  search: string,
  filter: TaskFilter,
  sort: TaskSort
): Task[] => sortTasks(filterTasks(searchTasks(tasks, search), filter), sort);
