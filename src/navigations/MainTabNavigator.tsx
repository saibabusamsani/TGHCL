import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/ionicons';

import { MainTabParamList } from '../types';
import { useTheme } from '../theme';
import MoreScreen from '../features/more/MoreScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const PlaceholderScreen = () => <Text />;

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
        component={PlaceholderScreen}
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
        name="Tab1"
        component={PlaceholderScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'list' : 'list-outline'}
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
              name="ellipsis-vertical"
              size={iconSize.md}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};