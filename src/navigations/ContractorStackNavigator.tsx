import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ContractorStackParamList } from './navigation.types';
import { ContractorTabNavigator } from './ContractorTabNavigator';
import BillForm from '../features/bills/screens/BillForm';

const Stack = createNativeStackNavigator<ContractorStackParamList>();

export const ContractorStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTab" component={ContractorTabNavigator} />
    <Stack.Screen
      name="BillForm"
      component={BillForm}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
  </Stack.Navigator>
);