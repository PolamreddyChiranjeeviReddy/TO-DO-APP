import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginRequest, RegisterRequest, User } from '../types/auth';
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
} from '../services/authService';
import {
  getToken,
  saveToken,
  clearToken,
  getErrorMessage,
  isUnauthorizedError,
} from '../services/api';

// Auth state machine. `isRestoring` gates the root navigator while the
// persisted session is loaded on app launch (see restoreSession below).
interface AuthState {
  user: User | null;
  token: string | null;
  isRestoring: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isRestoring: true,
  loading: false,
  error: null,
};

// Login/register: on success the returned JWT is persisted so the session
// survives an app restart, then the whole response is stored in Redux.
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginUser(data);
      await saveToken(response.token);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await registerUser(data);
      await saveToken(response.token);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Called on app launch to restore the persisted session from AsyncStorage.
// A stored token is only cleared when the server rejects it (401); transient
// network errors keep the token so the user isn't logged out accidentally.
export const restoreSession = createAsyncThunk(
  'auth/restore',
  async (_, { rejectWithValue }) => {
    const token = await getToken();
    if (!token) {
      return null;
    }
    try {
      const user = await fetchCurrentUser();
      return { token, user };
    } catch (error: unknown) {
      // Remove a rejected token, but keep it on transient network errors
      if (isUnauthorizedError(error)) {
        await clearToken();
      }
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await clearToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(restoreSession.pending, state => {
        state.isRestoring = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isRestoring = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      .addCase(restoreSession.rejected, state => {
        state.isRestoring = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
