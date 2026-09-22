import type {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Admin: undefined;
  Contractor: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  More: undefined;
  Bills: undefined;
};

export type ContractorStackParamList = {
  MainTab: NavigatorScreenParams<MainTabParamList>;
  BillForm: undefined
};

export type AdminStackParamList = {
  MainTab: undefined;
  Tab1: undefined;
};

export type NotificationNavigationParamList = {
  BillForm: undefined;
  MainTab: NavigatorScreenParams<MainTabParamList>;
};