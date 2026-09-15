import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContractorStackParamList } from '../types';
import { Text } from 'react-native';
import { MainTabNavigator } from './MainTabNavigator';


const Stack = createNativeStackNavigator<ContractorStackParamList>();

 const Tab1 = () => <Text>Tab1</Text>

export const ContractorStackNavigator = ()=> {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="MainTab" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Tab1" component={Tab1} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}