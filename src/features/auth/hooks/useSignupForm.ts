import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useLazyCheckBeneficiaryMobileQuery, useRegisterBeneficiaryMutation } from '../auth.api';
import { AppTheme } from '../../../theme';
import { validateMobileNumber } from '../../../utils';

const SUCCESS = 1;

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'Upper & lowercase letters', test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: 'At least one number', test: (v: string) => /\d/.test(v) },
  { label: 'At least one special character', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_LEVELS: { label: string; tone: keyof AppTheme['colors'] }[] = [
  { label: '', tone: 'border' },
  { label: 'Weak', tone: 'error' },
  { label: 'Fair', tone: 'warning' },
  { label: 'Good', tone: 'accent' },
  { label: 'Strong', tone: 'success' },
];

export const MAX_STRENGTH = PASSWORD_RULES.length;

const getErrorMessage = (err: any) => err?.data?.message ?? 'Something went wrong. Please try again.';

export const useSignupForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [checkMobile, { data: checkResult, isFetching: isChecking }] = useLazyCheckBeneficiaryMobileQuery();
  const [registerBeneficiary, { isLoading: isRegistering }] = useRegisterBeneficiaryMutation();

  const [step, setStep] = useState<1 | 2>(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const strength = useMemo(() => {
    const rules = PASSWORD_RULES.map(rule => ({ label: rule.label, met: rule.test(password) }));
    const score = password ? rules.filter(rule => rule.met).length : 0;
    return { rules, score, level: STRENGTH_LEVELS[score], isStrong: score === MAX_STRENGTH };
  }, [password]);

  const canRegister = strength.isStrong && password === confirmPassword;

  const withClearError = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setError('');
  };

  const verifyMobile = async () => {
    const mobileError = validateMobileNumber(mobileNumber);
    if (mobileError) return setError(mobileError);

    try {
      const { status, message } = await checkMobile({ mobileNumber }).unwrap();

      if (status !== SUCCESS) {
        return setError(message || 'No beneficiary record found for this mobile number.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const register = async () => {
    if (!canRegister) return;

    try {
      const { status, message } = await registerBeneficiary({
        applicationNo: checkResult?.response?.applicationNo ?? '',
        mobileNumber,
        password,
      }).unwrap();

      if (status !== SUCCESS) return setError(message || 'Registration failed. Please try again.');

      Alert.alert('Registration Successful', message || 'Please sign in to continue.', [
        { text: 'Sign In', onPress: onSuccess },
      ]);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return {
    step,
    record: checkResult?.status === SUCCESS ? checkResult.response : undefined,
    error,
    strength,
    canRegister,
    isChecking,
    isRegistering,
    showPassword,
    values: { mobileNumber, password, confirmPassword },
    setMobileNumber: withClearError(v => setMobileNumber(v.replace(/\D/g, ''))),
    setPassword: withClearError(setPassword),
    setConfirmPassword: withClearError(setConfirmPassword),
    togglePassword: () => setShowPassword(v => !v),
    goToPassword: () => setStep(2),
    backToMobile: () => {
      setStep(1);
      setError('');
    },
    verifyMobile,
    register,
  };
};

export type PasswordStrength = ReturnType<typeof useSignupForm>['strength'];