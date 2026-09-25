import { setupListeners } from '@reduxjs/toolkit/query';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';

// Makes refetchOnReconnect / refetchOnFocus work in React Native.
// Call once after creating the store: setupRtkListeners(store.dispatch);
export const setupRtkListeners = (dispatch: Parameters<typeof setupListeners>[0]) =>
  setupListeners(dispatch, (d, { onFocus, onFocusLost, onOnline, onOffline }) => {
    const netUnsub = NetInfo.addEventListener((state) => {
      d(state.isConnected ? onOnline() : onOffline());
    });

    const appStateSub = AppState.addEventListener('change', (status) => {
      d(status === 'active' ? onFocus() : onFocusLost());
    });

    return () => {
      netUnsub();
      appStateSub.remove();
    };
  });