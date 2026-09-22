import { createNavigationContainerRef } from '@react-navigation/native';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import type { NotificationNavigationParamList } from '../types';

export const navigationRef = createNavigationContainerRef<NotificationNavigationParamList>();

type NotificationPayload = RemoteMessage['data'];

export const routeNotification = (payload: NotificationPayload) => {

  if (!navigationRef.isReady()) {
    return;
  }

  const { type } = payload ?? {};
  const routeNames = navigationRef.getState()?.routeNames ?? [];

  switch (type) {

    case 'BILL_REJECTED':
      if (!routeNames.includes('BillForm')) {
        return;
      }
      navigationRef.navigate('BillForm');
      return;

    default:
      console.warn('[FCM] Unknown notification type:', type);
  }
};