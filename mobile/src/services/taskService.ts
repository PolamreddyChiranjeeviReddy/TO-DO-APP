import { api } from './api';
import {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from '../types/task';

export const fetchTasks = (): Promise<Task[]> =>
  api.get('/tasks').then(res => res.data.data);

export const createTask = (data: CreateTaskRequest): Promise<Task> =>
  api.post('/tasks', data).then(res => res.data.data);

export const updateTask = (id: string, data: UpdateTaskRequest): Promise<Task> =>
  api.patch(`/tasks/${id}`, data).then(res => res.data.data);

export const deleteTask = (id: string): Promise<void> =>
  api.delete(`/tasks/${id}`).then(res => res.data);
