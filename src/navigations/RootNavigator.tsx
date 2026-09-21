import React from 'react';
import SplashScreen from "../screens/SplashScreen"
import { DESIGNATION } from '../constants';
import AuthNavigator from './AuthNavigator';
import { AdminStackNavigator } from './AdminStackNavigator';
import { ContractorStackNavigator } from './ContractorStackNavigator';
import { useAuthBootstrap } from '../features/auth/hooks/useAuthBootstrap';
import { usePushNotifications } from '../hooks';


export const RootNavigator = ()=>{

  const { isLoggedIn,designationId} = useAuthBootstrap();
   
  usePushNotifications(isLoggedIn);

  if (isLoggedIn === null) {
    return <SplashScreen/>;
  }
   if (!isLoggedIn) {
    return <AuthNavigator />;
  }

  switch (designationId) {
    case DESIGNATION.Contractor:
      return <ContractorStackNavigator />;
    case DESIGNATION.ADMIN:
      return <AdminStackNavigator />;
    default:
      return <AuthNavigator />;
  }

}