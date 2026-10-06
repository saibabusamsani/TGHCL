import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TAB } from '../constants';
import { useTabScreenOptions } from './useTabScreenOptions';
import BeneficiaryHomeScreen from '../features/dashboard/screens/BeneficiaryHomeScreen';
import MileStoneTracker from '../features/projects/screens/MileStoneTracker';
import MoreScreen from '../features/profile/ProfileScreen';
import { BeneficiaryTabParamList } from './navigation.types';
import { PaymentScreen } from '../features/payments/screens/PaymentScreen';

const Tab = createBottomTabNavigator<BeneficiaryTabParamList>();

export const BeneficiaryTabNavigator = () => {
  const screenOptions = useTabScreenOptions();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name={TAB.HOME} component={BeneficiaryHomeScreen} />
      <Tab.Screen name={TAB.MY_HOUSE} component={MileStoneTracker} />
      <Tab.Screen name={TAB.PAYMENTS} component={PaymentScreen} />
      <Tab.Screen name={TAB.PROFILE} component={MoreScreen} />
    </Tab.Navigator>
  );
};