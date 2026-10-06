import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BeneficiaryStackParamList } from './navigation.types';
import { BeneficiaryTabNavigator } from './BeneficiaryTabNavigator';

const Stack = createNativeStackNavigator<BeneficiaryStackParamList>();

export const BeneficiaryStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTab" component={BeneficiaryTabNavigator} />
  </Stack.Navigator>
);