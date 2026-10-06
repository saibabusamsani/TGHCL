import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';

import { useThemedStyles, useTheme, AppTheme } from '../../../theme';
import { AppText, Button } from '../../../components';
import { useForgotPassword, ForgotPasswordFlow } from '../hooks/useForgotPassword';
import { EmployeeIdStep, OtpStep, NewPasswordStep } from '../components/ForgotPasswordSteps';
import { ForgotPasswordStep } from '../auth.type';

const STEPS: {
  key: ForgotPasswordStep;
  label: string;
  Component: React.ComponentType<{ flow: ForgotPasswordFlow }>;
}[] = [
  { key: 'EMPLOYEE_ID', label: 'Verify ID', Component: EmployeeIdStep },
  { key: 'OTP', label: 'Enter OTP', Component: OtpStep },
  { key: 'NEW_PASSWORD', label: 'New Password', Component: NewPasswordStep },
];

export default function ForgetPassword() {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const navigation = useNavigation();
  const flow = useForgotPassword();

  const activeIndex = STEPS.findIndex((s) => s.key === flow.step);
  const ActiveStep = STEPS[activeIndex]?.Component;
  const isSuccess = !ActiveStep;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <AppText variant="h2" style={styles.title}>Reset Password</AppText>
          <AppText variant="body" style={styles.subtitle}>
            Recover access to your official account
          </AppText>
        </View>

        {!isSuccess && (
          <View style={styles.stepper}>
            {STEPS.map((step, index) => {
              const isDone = index < activeIndex;
              const isActive = index === activeIndex;
              const isHighlighted = isDone || isActive;

              return (
                <React.Fragment key={step.key}>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, isHighlighted && styles.stepCircleActive]}>
                      {isDone ? (
                        <Feather name="check" size={iconSize.xs} color={colors.surface} />
                      ) : (
                        <AppText
                          variant="caption"
                          style={isHighlighted ? styles.stepNumberActive : styles.stepNumber}
                        >
                          {index + 1}
                        </AppText>
                      )}
                    </View>
                    <AppText
                      variant="caption"
                      style={isActive ? styles.stepLabelActive : styles.stepLabel}
                    >
                      {step.label}
                    </AppText>
                  </View>
                  {index < STEPS.length - 1 && (
                    <View style={[styles.connector, isDone && styles.connectorActive]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        )}

        <View style={styles.card}>
          {ActiveStep ? (
            <ActiveStep flow={flow} />
          ) : (
            <View style={styles.success}>
              <Feather name="check-circle" size={iconSize.xl} color={colors.primary} />
              <AppText variant="subtitle" style={styles.successTitle}>
                Password updated successfully
              </AppText>
              <AppText variant="body" style={styles.successText}>
                You can now sign in with your new password. Do not share your password or OTP
                with anyone.
              </AppText>
              <Button title="Back to Login" onPress={navigation.goBack} />
            </View>
          )}
        </View>

        {!isSuccess && (
          <View style={styles.footer}>
            <TouchableOpacity onPress={navigation.goBack} accessibilityRole="button">
              <AppText variant="body" style={styles.link}>Back to Login</AppText>
            </TouchableOpacity>
            <AppText variant="caption" style={styles.footerNote}>
              Facing issues? Contact your department system administrator.
            </AppText>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = ({ spacing, colors, radius, shadow, iconSize }: AppTheme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    header: {
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
    },
    title: {
      color: colors.text,
    },
    subtitle: {
      color: colors.textLight,
      marginTop: spacing.xs,
    },

    stepper: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    stepItem: {
      alignItems: 'center',
    },
    stepCircle: {
      width: iconSize.lg,
      height: iconSize.lg,
      borderRadius: radius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepCircleActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    stepNumber: {
      color: colors.textLight,
    },
    stepNumberActive: {
      color: colors.surface,
    },
    stepLabel: {
      color: colors.textLight,
      marginTop: spacing.xs,
    },
    stepLabelActive: {
      color: colors.primary,
      fontWeight: '600',
      marginTop: spacing.xs,
    },
    connector: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginTop: iconSize.lg / 2,
      marginHorizontal: spacing.xs,
    },
    connectorActive: {
      backgroundColor: colors.primary,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      ...shadow.md,
    },

    success: {
      alignItems: 'center',
      gap: spacing.sm,
    },
    successTitle: {
      color: colors.text,
      textAlign: 'center',
    },
    successText: {
      color: colors.textLight,
      textAlign: 'center',
      marginBottom: spacing.md,
    },

    footer: {
      alignItems: 'center',
      marginTop: spacing.lg,
      gap: spacing.sm,
    },
    link: {
      color: colors.primary,
      fontWeight: '600',
    },
    footerNote: {
      color: colors.textLight,
      textAlign: 'center',
    },
  });