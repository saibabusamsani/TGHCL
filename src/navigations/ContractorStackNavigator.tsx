import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContractorStackParamList } from '../types';
import { Text } from 'react-native';
import { MainTabNavigator } from './MainTabNavigator';
import BillForm from '../features/bills/screens/BillForm';


const Stack = createNativeStackNavigator<ContractorStackParamList>();


export const ContractorStackNavigator = ()=> {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="MainTab" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="BillForm" component={BillForm} options={{ headerShown: false,presentation:"modal" ,animation:"slide_from_bottom"}} />
    </Stack.Navigator>
  );
}