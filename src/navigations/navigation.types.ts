import {NavigatorScreenParams,ParamListBase,} from '@react-navigation/native';
import { TAB } from '../constants';
import { User } from '../features/auth/auth.type';


export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  LoginSuccess:{ loginDetails:User}
};

// BOTTOM TAB NAVIGATOR

export type BeneficiaryTabParamList = {
  [TAB.HOME]: undefined;
  [TAB.MY_HOUSE]: undefined;
  [TAB.PAYMENTS]: undefined;
  [TAB.PROFILE]: undefined;
};

export type ContractorTabParamList = {
  [TAB.HOME]: undefined;
  [TAB.PROJECTS]: undefined;
  [TAB.BILLS]: undefined;
  [TAB.PROFILE]: undefined;
};


// BOTTOM TAB STACK NAVIGATOR PARAMS LIST

export type BeneficiaryStackParamList = {
  MainTab: NavigatorScreenParams<BeneficiaryTabParamList>;
};

export type ContractorStackParamList = {
  MainTab: NavigatorScreenParams<ContractorTabParamList>;
  BillForm: { projectId?: number; billId?: number } | undefined;
};



// NOTIFICATION ROUTE TARGET

export type RouteTarget<P extends ParamListBase> = {
  [K in keyof P]: undefined extends P[K]
    ? { name: K; params?: P[K] }
    : { name: K; params: P[K] };
}[keyof P];


export type BeneficiaryTarget = RouteTarget<BeneficiaryStackParamList>;
export type ContractorTarget = RouteTarget<ContractorStackParamList>;

export type NotificationTarget = ContractorTarget | BeneficiaryTarget;