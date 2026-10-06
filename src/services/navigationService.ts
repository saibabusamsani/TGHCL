import { createNavigationContainerRef, ParamListBase } from '@react-navigation/native';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import { DESIGNATION, TAB } from '../constants';
import type { BeneficiaryTarget, ContractorTarget, NotificationTarget } from '../navigations/navigation.types';

export const navigationRef = createNavigationContainerRef<ParamListBase>();

type NotificationPayload = RemoteMessage['data'];
type Resolver = (payload: NotificationPayload) => NotificationTarget | null;

const resolveContractor = (payload: NotificationPayload): ContractorTarget | null => {
  switch (payload?.type) {
    case 'BILL_REJECTED':
      return { name: 'BillForm', params: { billId: Number(payload.billId) || undefined } };
    default:
      return null;
  }
};

const resolveBeneficiary = (payload: NotificationPayload): BeneficiaryTarget | null => {
  switch (payload?.type) {
    case 'PAYMENT_RELEASED':
      return { name: 'MainTab', params: { screen: TAB.PAYMENTS } };
    default:
      return null;
  }
};

const RESOLVERS: Record<number, Resolver> = {
  [DESIGNATION.Contractor]: resolveContractor,
  [DESIGNATION.BENEFICIARY]: resolveBeneficiary,
};

/** Returns false when navigation should be retried later (navigator not ready / role stack not mounted). */
export const routeNotification = (payload: NotificationPayload,designationId?: number | null,): boolean => {
  
  if (!navigationRef.isReady()) return false;

  const target = designationId != null ? RESOLVERS[designationId]?.(payload) : null;
  if (!target) {
    console.warn('[FCM] Unhandled notification type:', payload?.type);
    return true;
  }

  const routeNames = navigationRef.getRootState()?.routeNames ?? [];
  if (!routeNames.includes(target.name)) return false;

  navigationRef.navigate(target.name, target.params);
  return true;
};