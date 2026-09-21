import {getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  onTokenRefresh,
} from '@react-native-firebase/messaging';

import {requestNotificationPermission} from './permissionService';

const messaging = getMessaging(getApp());

export const initializePushNotifications = async () => {

  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    console.log('[PushNotification] Permission not granted');
    return undefined;
  }

  // Foreground
  const unsubscribeOnMessage = onMessage(messaging,async remoteMessage => {
      console.log('[PushNotification] Foreground message:',remoteMessage);

  
    },
  );

  // Background 
  const unsubscribeOnNotificationOpened = onNotificationOpenedApp(messaging,remoteMessage => {
      console.log('[PushNotification] Opened from background:',remoteMessage);

    
    },
  );

  // Terminated
  const initialMessage = await getInitialNotification(messaging);

  if (initialMessage) {
    console.log('[PushNotification] Opened from terminated state:',initialMessage);

    // Handle navigation here
  }

  //Refresh Token
  const unsubscribeOnTokenRefresh = onTokenRefresh(messaging,newToken => {

      console.log('[FCM] Token refreshed:', newToken);
    
    },
  );
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