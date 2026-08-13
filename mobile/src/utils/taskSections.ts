import { Task } from '../types/task';

export interface TaskSections {
  today: Task[];
  upcoming: Task[];
  completed: Task[];
}

// Returns true when the task is due today or is already overdue
const isDueToday = (task: Task): boolean => {
  const target = task.deadline || task.dateTime;
  if (!target) return false;
  const due = new Date(target);
  if (Number.isNaN(due.getTime())) return false;

  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return due.getTime() < endOfToday.getTime();
};

// Groups tasks into dashboard sections without mutating the input.
// Every task lands in exactly one section:
// - today:      not completed, due today or overdue
// - upcoming:   not completed, due later or with no date
// - completed:  completed tasks
export const groupTasksIntoSections = (tasks: Task[]): TaskSections => {
  const sections: TaskSections = { today: [], upcoming: [], completed: [] };

  for (const task of tasks) {
    if (task.completed) {
      sections.completed.push(task);
    } else if (isDueToday(task)) {
      sections.today.push(task);
    } else {
      sections.upcoming.push(task);
    }
  }

  return sections;
};
