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

type IconArgs = { color: string; focused: boolean };

const TabIcon = ({ color, focused, name, unfocusedName = name }: IconArgs & { name: string; unfocusedName?: string }) => {
  const { iconSize } = useTheme();
  return <Icon name={(focused ? name : unfocusedName) as any} size={iconSize.md} color={color} />;
};

const tabIcon = (name: string, unfocusedName?: string) => (props: IconArgs) => (
  <TabIcon {...props} name={name} unfocusedName={unfocusedName} />
);

const TABS = [
  { name: 'Home', component: DashboardScreen, icon: tabIcon('home', 'home-outline') },
  { name: 'Projects', component: ProjectList, icon: tabIcon('business-outline') },
  { name: 'Bills', component: BillList, icon: tabIcon('receipt-outline') },
  { name: 'More', component: MoreScreen, icon: tabIcon('ellipsis-horizontal') },
] as const;

export const MainTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { color: colors.text },
      }}
    >
      {TABS.map(({ name, component, icon }) => (
        <Tab.Screen key={name} name={name} component={component} options={{ tabBarIcon: icon }} />
      ))}
    </Tab.Navigator>
  );
};