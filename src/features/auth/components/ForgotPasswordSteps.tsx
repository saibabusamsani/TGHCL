import React, { memo, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { useThemedStyles, useTheme, AppTheme } from '../../../theme';
import { AppText, Button } from '../../../components';
import { FormInput } from './FormInput';
import { ForgotPasswordFlow, OTP_LENGTH } from '../hooks/useForgotPassword';

type StepProps = { flow: ForgotPasswordFlow };

export const EmployeeIdStep = memo<StepProps>(({ flow }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <AppText variant="subtitle" style={styles.title}>Verify your Employee ID</AppText>
      <AppText variant="body" style={styles.description}>
        Enter your registered Employee ID. An OTP will be sent to the mobile number linked with
        your account.
      </AppText>

      <FormInput
        label="EMPLOYEE ID"
        iconName="user"
        placeholder="Enter your Employee ID"
        value={flow.employeeId}
        onChangeText={flow.onChangeEmployeeId}
        error={flow.errorMessage}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={flow.submitEmployeeId}
      />

      <View style={styles.action}>
        <Button
          title="Send OTP"
          onPress={flow.submitEmployeeId}
          loading={flow.isSubmittingEmployeeId}
          disabled={flow.isSubmittingEmployeeId}
        />
      </View>
    </>
  );
});

export const OtpStep = memo<StepProps>(({ flow }) => {
  const styles = useThemedStyles(createStyles);
  const canResend = flow.resendSecondsLeft === 0 && !flow.isResendingOtp;

  const resendLabel = flow.isResendingOtp
    ? 'Sending...'
    : flow.resendSecondsLeft > 0
      ? `Resend in ${flow.resendSecondsLeft}s`
      : 'Resend OTP';

  return (
    <>
      <AppText variant="subtitle" style={styles.title}>Enter OTP</AppText>
      <AppText variant="body" style={styles.description}>
        A {OTP_LENGTH}-digit OTP has been sent to the mobile number registered with Employee ID{' '}
        <AppText variant="body" style={styles.emphasis}>{flow.employeeId}</AppText>
      </AppText>

      <TouchableOpacity onPress={flow.goToEmployeeIdStep} accessibilityRole="button">
        <AppText variant="caption" style={styles.link}>Change Employee ID</AppText>
      </TouchableOpacity>

      <FormInput
        label="ONE-TIME PASSWORD"
        iconName="shield"
        placeholder={'•'.repeat(OTP_LENGTH)}
        value={flow.otp}
        onChangeText={flow.onChangeOtp}
        error={flow.errorMessage}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
      />

      <View style={styles.resendRow}>
        <AppText variant="caption" style={styles.muted}>Didn't receive the OTP?</AppText>
        <TouchableOpacity onPress={flow.resendOtp} disabled={!canResend} accessibilityRole="button">
          <AppText variant="caption" style={canResend ? styles.link : styles.muted}>
            {resendLabel}
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.action}>
        <Button
          title="Verify OTP"
          onPress={flow.submitOtp}
          loading={flow.isVerifyingOtp}
          disabled={flow.isVerifyingOtp || flow.otp.length !== OTP_LENGTH}
        />
      </View>
    </>
  );
});

export const NewPasswordStep = memo<StepProps>(({ flow }) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const confirmError =
    flow.confirmPassword.length > 0 && !flow.doPasswordsMatch ? 'Passwords do not match.' : undefined;

  return (
    <>
      <AppText variant="subtitle" style={styles.title}>Set a new password</AppText>
      <AppText variant="body" style={styles.description}>
        Create a strong password that you have not used before.
      </AppText>

      <FormInput
        label="NEW PASSWORD"
        iconName="lock"
        placeholder="Enter new password"
        value={flow.newPassword}
        onChangeText={flow.onChangeNewPassword}
        error={flow.errorMessage}
        secureTextEntry={!isPasswordVisible}
        trailingIcon={isPasswordVisible ? 'eye-off' : 'eye'}
        onTrailingIconPress={() => setIsPasswordVisible((v) => !v)}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="newPassword"
      />

      <View style={styles.rules}>
        {flow.passwordChecks.map((check) => (
          <View key={check.label} style={styles.ruleRow}>
            <Feather
              name={check.passed ? 'check-circle' : 'circle'}
              size={iconSize.xs}
              color={check.passed ? colors.primary : colors.textLight}
            />
            <AppText variant="caption" style={check.passed ? styles.rulePassed : styles.muted}>
              {check.label}
            </AppText>
          </View>
        ))}
      </View>

      <FormInput
        label="CONFIRM PASSWORD"
        iconName="lock"
        placeholder="Re-enter new password"
        value={flow.confirmPassword}
        onChangeText={flow.onChangeConfirmPassword}
        error={confirmError}
        secureTextEntry={!isPasswordVisible}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.action}>
        <Button
          title="Update Password"
          onPress={flow.submitNewPassword}
          loading={flow.isResettingPassword}
          disabled={flow.isResettingPassword || !flow.isPasswordValid || !flow.doPasswordsMatch}
        />
      </View>
    </>
  );
});

const createStyles = ({ spacing, colors, radius }: AppTheme) =>
  StyleSheet.create({
    title: {
      color: colors.text,
    },
    description: {
      color: colors.textLight,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },
    emphasis: {
      color: colors.text,
      fontWeight: '600',
    },
    link: {
      color: colors.primary,
      fontWeight: '600',
    },
    muted: {
      color: colors.textLight,
    },
    resendRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    rules: {
      backgroundColor: colors.background,
      borderRadius: radius.md,
      padding: spacing.sm,
      marginTop: spacing.sm,
      gap: spacing.xs,
    },
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    rulePassed: {
      color: colors.primary,
    },
    action: {
      marginTop: spacing.lg,
    },
  });