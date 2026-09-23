import { LoginPayload } from '../../types/auth.type';

export type FieldName = Exclude<keyof LoginPayload,"regId">;
export type FieldErrors = Partial<Record<FieldName, string>>;

export interface FormState {
  values: Omit<LoginPayload,"regId">;
  errors: FieldErrors;
  showPassword: boolean;
}

export type LoginStatus = 1 | 2 | 5;

export type FaceScanStatus =
  | 'idle'
  | 'scanning'
  | 'captured'
  | 'verifying'
  | 'verified'
  | 'failed';
