import React from 'react';
import SplashScreen from "../screens/SplashScreen"
import { DESIGNATION } from '../constants';
import AuthNavigator from './AuthNavigator';
import { ContractorStackNavigator } from './ContractorStackNavigator';
import { useAuthBootstrap } from '../features/auth/hooks/useAuthBootstrap';
import { BeneficiaryStackNavigator } from './BeneficiaryStackNavigator';

export const RootNavigator = () => {
  const { isLoggedIn, designationId} = useAuthBootstrap();
  // usePushNotifications(isLoggedIn, fcmToken);

  if (isLoggedIn === null) {
    return <SplashScreen/>;
  }
   if (!isLoggedIn) {
    return <AuthNavigator />;
  }

  switch (designationId) {
     case DESIGNATION.BENEFICIARY:
      return <BeneficiaryStackNavigator />;
    case DESIGNATION.Contractor:
      return <ContractorStackNavigator />;
    default:
      return <AuthNavigator />;
  }

}