import {useEffect} from 'react';
import { getFcmToken, initializePushNotifications } from '../services/notificationService';


export const usePushNotifications = (isLoggedIn: boolean | null) => {

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const initialize = async () => {
      try {
        unsubscribe =  await initializePushNotifications();
      } catch (error) {
        console.error('[PushNotification] Initialization failed:',error);
      }
    };

    initialize();

    return () => {
      unsubscribe?.();
    };
  }, [isLoggedIn]);
};