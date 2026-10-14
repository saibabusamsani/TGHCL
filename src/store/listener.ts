import { createListenerMiddleware } from '@reduxjs/toolkit';
import { clearUser } from './authSlice';
import { baseApi } from '../api/baseApi';
import { storageHelper } from '../utils/storageHelper';
import { STORAGE_KEYS } from '../constants';

export const listener = createListenerMiddleware();

listener.startListening({
  actionCreator: clearUser,
  effect: async (_, api) => {
    api.dispatch(baseApi.util.resetApiState());
    try {
      await storageHelper.remove(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.warn('[auth] Failed to remove persisted user data', error);
    }
  },
});