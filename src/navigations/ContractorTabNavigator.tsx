import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TAB } from '../constants';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import ProjectList from '../features/projects/screens/ProjectList';
import BillList from '../features/bills/screens/BillList';
import { ContractorTabParamList } from './navigation.types';
import { useTabScreenOptions } from './useTabScreenOptions';
import ProfileScreen from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator<ContractorTabParamList>();

export const ContractorTabNavigator = () => {
  const screenOptions = useTabScreenOptions( { headerShown :false });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name={TAB.HOME} component={DashboardScreen} />
      <Tab.Screen name={TAB.PROJECTS} component={ProjectList} />
      <Tab.Screen name={TAB.BILLS} component={BillList} />
      <Tab.Screen name={TAB.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
};