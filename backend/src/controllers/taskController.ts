import { Response } from 'express';
import mongoose from 'mongoose';
import Task, { PRIORITY_VALUES, Priority } from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

const getUserId = (req: AuthRequest) => req.user!._id.toString();

// Returns true and sends a 400 when the id is not a valid ObjectId
const isInvalidId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: 'Invalid task id' });
    return true;
  }
  return false;
};

// Builds the ownership-scoped query from the request query params
const buildFilter = (req: AuthRequest) => {
  const filter: Record<string, unknown> = { userId: getUserId(req) };
  const { search, category, tag, priority, status } = req.query;

  if (search) {
    filter.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { description: { $regex: search as string, $options: 'i' } },
    ];
  }
  if (category) filter.category = category;
  if (tag) filter.tags = { $in: [tag] };
  if (priority) filter.priority = priority;

  if (status === 'completed') {
    filter.completed = true;
  } else if (status === 'pending') {
    filter.completed = false;
  } else if (status === 'overdue') {
    filter.completed = false;
    filter.deadline = { $lt: new Date() };
  }

  return filter;
};

const buildSort = (req: AuthRequest): Record<string, 1 | -1> => {
  const sort = req.query.sort;
  switch (sort) {
    case 'deadline':
      return { deadline: 1 };
    case 'priority':
      // high priority first
      return { priority: -1 };
    case 'oldest':
      return { createdAt: 1 };
    default:
      return { createdAt: -1 };
  }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  const filter = buildFilter(req);
  const sort = buildSort(req);
  const tasks = await Task.find(filter).sort(sort);
  res.json({ success: true, data: tasks });
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isInvalidId(id, res)) return;

  const task = await Task.findOne({ _id: id, userId: getUserId(req) });
  if (!task) {
    res.status(404).json({ success: false, message: 'Task not found' });
    return;
  }

  res.json({ success: true, data: task });
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, dateTime, deadline, priority, category, tags } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({ success: false, message: 'Title is required' });
    return;
  }

  if (deadline && Number.isNaN(new Date(deadline).getTime())) {
    res.status(400).json({ success: false, message: 'Deadline must be a valid date' });
    return;
  }

  if (priority && !PRIORITY_VALUES.includes(priority as Priority)) {
    res.status(400).json({ success: false, message: 'Priority must be LOW, MEDIUM or HIGH' });
    return;
  }

  const task = await Task.create({
    userId: getUserId(req),
    title,
    description: description ?? '',
    dateTime: dateTime || undefined,
    deadline: deadline || undefined,
    priority: priority || 'MEDIUM',
    category: category || 'General',
    tags: Array.isArray(tags) ? tags : [],
  });

  res.status(201).json({ success: true, data: task });
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isInvalidId(id, res)) return;

  const task = await Task.findOne({ _id: id, userId: getUserId(req) });
  if (!task) {
    res.status(404).json({ success: false, message: 'Task not found' });
    return;
  }

  const { title, description, dateTime, deadline, priority, category, tags, completed } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      res.status(400).json({ success: false, message: 'Title is required' });
      return;
    }
    task.title = title;
  }
  if (description !== undefined) task.description = description;
  if (dateTime !== undefined) task.dateTime = dateTime;
  if (deadline !== undefined) {
    if (Number.isNaN(new Date(deadline).getTime())) {
      res.status(400).json({ success: false, message: 'Deadline must be a valid date' });
      return;
    }
    task.deadline = deadline;
  }
  if (priority !== undefined) {
    if (!PRIORITY_VALUES.includes(priority as Priority)) {
      res.status(400).json({ success: false, message: 'Priority must be LOW, MEDIUM or HIGH' });
      return;
    }
    task.priority = priority;
  }
  if (category !== undefined) task.category = category;
  if (tags !== undefined) task.tags = Array.isArray(tags) ? tags : task.tags;

  // Track when a task is (un)completed
  if (completed !== undefined) {
    task.completed = Boolean(completed);
    task.completedAt = task.completed ? new Date() : null;
  }

  await task.save();

  res.json({ success: true, data: task });
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isInvalidId(id, res)) return;

  const task = await Task.findOneAndDelete({ _id: id, userId: getUserId(req) });
  if (!task) {
    res.status(404).json({ success: false, message: 'Task not found' });
    return;
  }

  res.json({ success: true, data: {} });
};
