import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

// The phone reaches the host PC through an `adb reverse` USB tunnel, so the
// API host is the phone's own loopback. On web, localhost is the PC itself.
const BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach the stored JWT to every request before it is sent,
// so protected endpoints (tasks, /auth/me) can identify the caller
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let unauthorizedHandler: (() => void) | null = null;

// Lets the app react (e.g. dispatch logout) when a stored token becomes invalid
export const setUnauthorizedHandler = (handler: () => void): void => {
  unauthorizedHandler = handler;
};

export const isUnauthorizedError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 401;

// Force logout when an authenticated request is rejected with 401,
// except on login/register where 401 is a normal "invalid credentials" response
api.interceptors.response.use(
  response => response,
  async error => {
    const url: string = error.config?.url ?? '';
    const isAuthAttempt =
      url.includes('/auth/login') || url.includes('/auth/register');
    if (isUnauthorizedError(error) && !isAuthAttempt) {
      await clearToken();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export const saveToken = (token: string): Promise<void> =>
  AsyncStorage.setItem(TOKEN_KEY, token);

export const getToken = (): Promise<string | null> => AsyncStorage.getItem(TOKEN_KEY);

export const clearToken = (): Promise<void> => AsyncStorage.removeItem(TOKEN_KEY);

// Normalizes an unknown error into a readable message for UI banners.
// Prefers the backend's error message, then axios's, then a generic fallback.
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Something went wrong';
  }
  return error instanceof Error ? error.message : 'Something went wrong';
};
