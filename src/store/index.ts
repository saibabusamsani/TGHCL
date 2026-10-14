import { combineReducers, configureStore, UnknownAction } from '@reduxjs/toolkit';

import { authReducer, clearUser } from './authSlice';
import { baseApi } from '../api/baseApi';
import { listener } from './listener';
import { setupRtkListeners } from './setupListeners';

const appReducer = combineReducers({
  authentication: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

type AppState = ReturnType<typeof appReducer>;

const rootReducer = (state: AppState | undefined, action: UnknownAction): AppState => {
  if (clearUser.match(action)) {
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefault => getDefault().prepend(listener.middleware).concat(baseApi.middleware),
});

setupRtkListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;