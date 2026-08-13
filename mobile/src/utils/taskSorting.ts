import { Task, Priority } from '../types/task';
import { getRemainingMs } from './dateUtils';

// Weight for each priority level (HIGH > MEDIUM > LOW)
const PRIORITY_WEIGHT: Record<Priority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const DAY_MS = 24 * 60 * 60 * 1000;
// Time window over which the "due soon" pressure grows
const PRESSURE_WINDOW_MS = 7 * DAY_MS;

// Higher score = more urgent.
// Completed tasks always score 0 so they sink to the bottom.
// Overdue tasks get a large base penalty so they rise to the top.
export const calculateUrgencyScore = (task: Task): number => {
  if (task.completed) return 0;

  const base = PRIORITY_WEIGHT[task.priority];
  const remaining = getRemainingMs(task);

  // No deadline or scheduled time → only priority matters
  if (remaining === null) return base;

  // Overdue: very high urgency, growing slowly the longer it stays overdue
  if (remaining < 0) {
    const overduePenalty = Math.min(Math.abs(remaining) / DAY_MS, 10);
    return 100 + base + overduePenalty;
  }

  // Time pressure: the closer the deadline, the higher the score
  const pressure = Math.max(0, 1 - remaining / PRESSURE_WINDOW_MS);
  return base + pressure * 10;
};

// Returns a new sorted array; never mutates the input
export const sortTasksByUrgency = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => calculateUrgencyScore(b) - calculateUrgencyScore(a));
