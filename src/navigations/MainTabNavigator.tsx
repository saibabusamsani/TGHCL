import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/ionicons';
import { Text } from 'react-native';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const Tab1 = () => <Text></Text>;

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Tab1}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab1"
        component={Tab1}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'list' : 'list-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={Tab1}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="ellipsis-vertical" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};