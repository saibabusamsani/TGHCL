import React from 'react';
import SplashScreen from "../screens/SplashScreen"
import { useAuth } from '../hooks/useAuth';
import { DESIGNATION } from '../constants/designation';
import AuthNavigator from './AuthNavigator';
import { EmployeeStackNavigator } from './EmployeeStackNavigator';
import { AdminStackNavigator } from './AdminStackNavigator';


export const RootNavigator = ()=>{
  const { isLoggedIn,designationId} = useAuth();

  if (isLoggedIn === null) {
    return <SplashScreen/>;
  }
   if (!isLoggedIn) {
    return <AuthNavigator />;
  }

  switch (designationId) {
    case DESIGNATION.EMPLOYEE:
      return <EmployeeStackNavigator />;
    case DESIGNATION.ADMIN:
      return <AdminStackNavigator />;
    default:
      return <AuthNavigator />;
  }

}