import { ComponentProps } from 'react';
import Icon from '@react-native-vector-icons/ionicons';

type IconName = ComponentProps<typeof Icon>['name'];

export const TAB = {
  HOME: 'Home',
  PROJECTS: 'Projects',
  BILLS: 'Bills',
  MY_HOUSE: 'MyHouse',
  PAYMENTS: 'Payments',
  PROFILE: 'Porfile',
} as const;

export type TabName = (typeof TAB)[keyof typeof TAB];

export const TAB_ICON: Record<TabName, { active: IconName; inactive: IconName }> = {
  [TAB.HOME]: { active: 'home', inactive: 'home-outline' },
  [TAB.PROJECTS]: { active: 'briefcase', inactive: 'briefcase-outline' },
  [TAB.BILLS]: { active: 'receipt', inactive: 'receipt-outline' },
  [TAB.MY_HOUSE]: { active: 'business', inactive: 'business-outline' },
  [TAB.PAYMENTS]: { active: 'wallet', inactive: 'wallet-outline' },
  [TAB.PROFILE]: { active: 'person', inactive: 'person-outline' },
};