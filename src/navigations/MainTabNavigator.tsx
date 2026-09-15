import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/ionicons';

import { MainTabParamList } from '../types';
import { useTheme } from '../theme';
import MoreScreen from '../features/more/MoreScreen';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import ProjectList from '../features/projects/screens/ProjectList';
import BillList from '../features/bills/screens/BillList';

const Tab = createBottomTabNavigator<MainTabParamList>();


export const MainTabNavigator = () => {
  const { colors, iconSize } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },

        tabBarLabelStyle: {
          color: colors.text,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={iconSize.md}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Projects"
        component={ProjectList}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="business-outline"
              size={iconSize.md}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bills"
        component={BillList}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="receipt-outline"
              size={iconSize.md}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="ellipsis-horizontal"
              size={iconSize.md}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};