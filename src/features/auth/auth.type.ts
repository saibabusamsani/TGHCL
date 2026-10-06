import { DesignationId } from '../../constants';


export interface LoginPayload {
  username: string;
  password: string;
  regId: string;
}

export interface User {
  employeeName: string;
  mobileNumber: string;
  employeeId: string;
  designationId: DesignationId;
  status: number;
  email:string
}

export type FieldName = Exclude<keyof LoginPayload, 'regId'>;
export type FieldErrors = Partial<Record<FieldName, string>>;

export interface FormState {
  values: Omit<LoginPayload, 'regId'>;
  errors: FieldErrors;
  showPassword: boolean;
}

export type LoginStatus = -1 |  1 | 2 | 5;



export type ForgotPasswordStep = 'EMPLOYEE_ID' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

export interface PasswordCheck {
  label: string;
  passed: boolean;
}

export interface BeneficiaryMobile {
  name: string;
  loginCreated: boolean;
  applicationNo: string;
  mobileNumber: string;
}
export interface BeneficiaryRegistrationPayload {
  applicationNo: string;
  mobileNumber: string;
  password: string;
}