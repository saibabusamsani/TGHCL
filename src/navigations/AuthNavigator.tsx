import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import ForgetPassword from '../features/auth/screens/ForgetPassword.tsx';
import { AuthStackParamList } from './navigation.types.ts';
import AuthSuccessScreen from '../features/auth/screens/AuthSuccessScreen.tsx';
import SignupScreen from '../features/auth/screens/SignupScreen.tsx';


const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgetPassword} />
      <Stack.Screen name="LoginSuccess" component={AuthSuccessScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}