import {getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  onTokenRefresh,
  type RemoteMessage,
} from '@react-native-firebase/messaging';

import {requestNotificationPermission} from './permissionService';
import {routeNotification} from './navigationService';
import {storageHelper} from '../utils';
import {STORAGE_KEYS} from '../constants';

const messaging = getMessaging(getApp());

let currentSyncedToken: string | null = null;

const handleNotificationTap = (message: RemoteMessage) => {

  routeNotification(message.data);
  // routeNotification(
  //   {
  //        type:"BILL_REJECTED"
    
  //   }
  //  );
};

const syncFcmToken = async () => {
  try {
    const token = await getToken(messaging);

    if (!token || token === currentSyncedToken) {
      return;
    }

    // TODO: Register token with backend.
    await storageHelper.set(STORAGE_KEYS.FCM_TOKEN, token);
    currentSyncedToken = token;
  } catch (error) {
    console.warn('[FCM] Token sync failed:', error);
  }
};

export const initializePushNotifications = async (lastSyncedToken: string | null) => {
  currentSyncedToken = lastSyncedToken;

  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    console.log('[FCM] Notification permission not granted');
    return undefined;
  }

  // Foreground
  const unsubscribeOnMessage = onMessage(messaging, message => {
    console.log('[FCM] Foreground message:', message);
  });

  // Background
  const unsubscribeOnNotificationOpened = onNotificationOpenedApp(
    messaging,
    handleNotificationTap,
  );

  // Terminated
  const initialMessage = await getInitialNotification(messaging);

  if (initialMessage) {
    handleNotificationTap(initialMessage);
  }

  // Uses the bootstrap-supplied value first; falls back to whatever
  // was last synced in-memory for any refresh after that.
  await syncFcmToken();

  // Token refresh
  const unsubscribeOnTokenRefresh = onTokenRefresh(messaging, () => {
    syncFcmToken();
  });

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnNotificationOpened();
    unsubscribeOnTokenRefresh();
  };
};

export const getFcmToken = async (): Promise<string | null> => {
  try {
    const token = await getToken(messaging);

    if (!token) {
      console.warn('[FCM] Registration token is unavailable');
      return null;
    }

    return token;
  } catch (error) {
    console.warn('[FCM] Failed to get registration token:',error);
    return null;
  }
};