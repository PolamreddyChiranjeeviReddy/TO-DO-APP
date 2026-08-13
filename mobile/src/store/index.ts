import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './authSlice';
import taskReducer from './taskSlice';

// Central Redux store combining the auth and task slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});

// Typed hooks so components never have to annotate dispatch/state manually
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
