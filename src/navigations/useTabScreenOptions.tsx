import React, { useCallback } from 'react';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/ionicons';

import { useTheme } from '../theme';
import { AppHeader, HeaderAction } from '../components/AppHeader';
import { TAB, TAB_ICON, TabName } from '../constants';

type Params = { route: RouteProp<ParamListBase> };

/** Right-side header content per tab. Tabs not listed show the logo only. */
const HEADER_ACTION: Partial<Record<string, HeaderAction>> = {
  [TAB.HOME]: 'notifications',
  [TAB.PAYMENTS]: 'secure',
};

export const useTabScreenOptions = () => {
  const { colors, iconSize } = useTheme();

  return useCallback(
    ({ route }: Params): BottomTabNavigationOptions => {
      const { active, inactive } = TAB_ICON[route.name as TabName];

      return {
        header: () => <AppHeader action={HEADER_ACTION[route.name]} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, focused }) => (
          <Icon name={focused ? active : inactive} size={iconSize.md} color={color} />
        ),
      };
    },
    [colors, iconSize],
  );
};