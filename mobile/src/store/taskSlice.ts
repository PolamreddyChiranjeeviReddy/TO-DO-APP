import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/taskService';
import { getErrorMessage } from '../services/api';

// Task state machine. `loading` covers the initial list fetch while `saving`
// covers create/update/delete (used to disable buttons during mutations).
interface TaskState {
  tasks: Task[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  mutationError: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  saving: false,
  error: null,
  mutationError: null,
};

// Fetch the current user's tasks from the API into the store
export const loadTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTasks();
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addTask = createAsyncThunk<Task, CreateTaskRequest, { rejectValue: string }>(
  'tasks/add',
  async (data, { rejectWithValue }) => {
    try {
      return await createTask(data);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const editTask = createAsyncThunk<
  Task,
  { id: string; data: UpdateTaskRequest },
  { rejectValue: string }
>('tasks/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateTask(id, data);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const removeTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTask(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetTasks: state => {
      state.tasks = [];
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(addTask.pending, state => {
        state.saving = true;
        state.mutationError = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.saving = false;
        state.mutationError = null;
        state.tasks.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.saving = false;
        state.mutationError = action.payload ?? null;
      })
      .addCase(editTask.pending, state => {
        state.saving = true;
        state.mutationError = null;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.saving = false;
        state.mutationError = null;
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.saving = false;
        state.mutationError = action.payload ?? null;
      })
      .addCase(removeTask.pending, state => {
        state.saving = true;
        state.mutationError = null;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.saving = false;
        state.mutationError = null;
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.saving = false;
        state.mutationError = action.payload ?? null;
      });
  },
});

export const { resetTasks } = taskSlice.actions;

export const selectTaskState = (state: RootState) => state.tasks;

export default taskSlice.reducer;
