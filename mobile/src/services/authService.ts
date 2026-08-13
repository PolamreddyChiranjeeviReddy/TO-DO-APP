import { api } from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

// Thin wrappers around the auth endpoints. Each returns the API's `data`
// payload directly (unwrapping the `{ success, data }` envelope).
export const registerUser = (data: RegisterRequest): Promise<AuthResponse> =>
  api.post('/auth/register', data).then(res => res.data.data);

export const loginUser = (data: LoginRequest): Promise<AuthResponse> =>
  api.post('/auth/login', data).then(res => res.data.data);

export const fetchCurrentUser = (): Promise<User> =>
  api.get('/auth/me').then(res => res.data.data);
