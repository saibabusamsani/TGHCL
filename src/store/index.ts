import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import { baseApi } from '../api/baseApi';
import { setupRtkListeners } from './setupListeners';


export const store = configureStore({
  reducer: {
    authentication: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

setupRtkListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;