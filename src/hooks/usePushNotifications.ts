import {useEffect} from 'react';
import {initializePushNotifications} from '../services/notificationService';

export const usePushNotifications = (isLoggedIn: boolean | null,lastSyncedToken: string | null) => {
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const initialize = async () => {
      try {
        const cleanup = await initializePushNotifications(lastSyncedToken);

        if (cancelled) {
          cleanup?.();
          return;
        }
        unsubscribe = cleanup;
      } catch (error) {
        console.error('[PushNotification] Initialization failed:', error);
      }
    };

    initialize();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isLoggedIn, lastSyncedToken]);
};