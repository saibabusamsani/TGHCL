import { useEffect, useState } from 'react';
import {
  useLazyCheckEmployeeIdQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from '../auth.api';
import { ForgotPasswordStep, PasswordCheck, PasswordRule } from '../auth.type';

export const OTP_LENGTH = 6;
const OTP_RESEND_SECONDS = 60;

const PASSWORD_RULES: PasswordRule[] = [
  { label: 'Minimum 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter (a-z)', test: (v) => /[a-z]/.test(v) },
  { label: 'One number (0-9)', test: (v) => /\d/.test(v) },
  { label: 'One special character (@, #, $ ...)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const useForgotPassword = () => {
  const [step, setStep] = useState<ForgotPasswordStep>('EMPLOYEE_ID');
  const [employeeId, setEmployeeId] = useState('8252035519');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);

  const [checkEmployeeId, { isFetching: isCheckingEmployeeId }] = useLazyCheckEmployeeIdQuery();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  useEffect(() => {
    if (resendSecondsLeft === 0) return;
    const timerId = setTimeout(() => setResendSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timerId);
  }, [resendSecondsLeft]);

  const passwordChecks: PasswordCheck[] = PASSWORD_RULES.map((rule) => ({
    label: rule.label,
    passed: rule.test(newPassword),
  }));
  const isPasswordValid = passwordChecks.every((check) => check.passed);
  const doPasswordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const clearError = () => {
    if (errorMessage) setErrorMessage('');
  };

  const onChangeEmployeeId = (text: string) => {
    setEmployeeId(text.trim());
    clearError();
  };

  const onChangeOtp = (text: string) => {
    setOtp(text.replace(/\D/g, ''));
    clearError();
  };

  const onChangeNewPassword = (text: string) => {
    setNewPassword(text);
    clearError();
  };

  const onChangeConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    clearError();
  };

  const requestOtp = async (): Promise<boolean> => {
    const result = await sendOtp({ employeeId });
    if ('error' in result) return false;

    setOtp('');
    setResendSecondsLeft(OTP_RESEND_SECONDS);
    return true;
  };

  const submitEmployeeId = async () => {
    if (!employeeId) {
      setErrorMessage('Employee ID is required.');
      return;
    }

    const { data: isRegistered, isError } = await checkEmployeeId({ employeeId });
    if (isError) return;

    if (!isRegistered) {
      setErrorMessage('No account found for this Employee ID.');
      return;
    }

    if (await requestOtp()) setStep('OTP');
  };

  const resendOtp = async () => {
    clearError();
    await requestOtp();
  };

  const submitOtp = async () => {
    if (otp.length !== OTP_LENGTH) {
      setErrorMessage(`Please enter the ${OTP_LENGTH}-digit OTP.`);
      return;
    }

    const result = await verifyOtp({ employeeId, otp });
    if ('error' in result) return;

    if (!result.data) {
      setErrorMessage('Invalid OTP. Please check and try again.');
      return;
    }

    setStep('NEW_PASSWORD');
  };

  const submitNewPassword = async () => {
    if (!isPasswordValid) {
      setErrorMessage('Password does not meet the security requirements.');
      return;
    }
    if (!doPasswordsMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const result = await resetPassword({ employeeId, newPassword :"123456"});
    if ('error' in result) return;

    setStep('SUCCESS');
  };

  const goToEmployeeIdStep = () => {
    clearError();
    setOtp('');
    setStep('EMPLOYEE_ID');
  };

  return {
    step,
    errorMessage,

    employeeId,
    onChangeEmployeeId,
    submitEmployeeId,
    isSubmittingEmployeeId: isCheckingEmployeeId || isSendingOtp,

    otp,
    onChangeOtp,
    submitOtp,
    resendOtp,
    resendSecondsLeft,
    isVerifyingOtp,
    isResendingOtp: isSendingOtp,
    goToEmployeeIdStep,

    newPassword,
    confirmPassword,
    onChangeNewPassword,
    onChangeConfirmPassword,
    passwordChecks,
    isPasswordValid,
    doPasswordsMatch,
    submitNewPassword,
    isResettingPassword,
  };
};

export type ForgotPasswordFlow = ReturnType<typeof useForgotPassword>;