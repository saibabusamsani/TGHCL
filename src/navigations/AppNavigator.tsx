import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from "../screens/SplashScreen"

import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../hooks/useAuth';


export default function AppNavigator() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) {
    return <SplashScreen/>;
  }

  return isLoggedIn? <MainTabNavigator /> : <AuthNavigator />


}