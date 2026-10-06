import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing,Pressable, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigations/navigation.types';
import { FormInput } from '../components/FormInput';
import { MAX_STRENGTH, PasswordStrength, useSignupForm } from '../hooks/useSignupForm';
import { AppText, Button } from '../../../components';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const STEPS = ['Verify Mobile', 'Set Password'] as const;

const SignupScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const form = useSignupForm({ onSuccess: navigation.goBack });
  const { step, record, error, values } = form;

  return (
    <View style={styles.screen}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Pressable
          style={styles.backBtn}
          onPress={step === 2 ? form.backToMobile : navigation.goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={iconSize.md} color={colors.text} />
        </Pressable>
        <View>
          <AppText variant="caption" color={colors.textLight} style={styles.overline}>
            TELANGANA HOUSING BOARD
          </AppText>
          <AppText variant="h2" color={colors.text}>
            Beneficiary Registration
          </AppText>
        </View>
      </View>


        <KeyboardAwareScrollView    style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Stepper */}
          <View style={[styles.card, styles.stepper]} accessibilityLabel={`Step ${step} of ${STEPS.length}`}>
            {STEPS.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <React.Fragment key={label}>
                  {i > 0 && <View style={[styles.stepLine, step > 1 && styles.stepLineDone]} />}
                  <View style={styles.inline}>
                    <View style={[styles.stepBadge, active && styles.stepActive, done && styles.stepDone]}>
                      {done ? (
                        <Feather name="check" size={iconSize.xs} color={colors.success} />
                      ) : (
                        <AppText variant="caption" color={active ? colors.textInverse : colors.textLight} style={styles.bold}>
                          {n}
                        </AppText>
                      )}
                    </View>
                    <AppText variant="caption" color={active || done ? colors.text : colors.textLight} style={styles.bold}>
                      {label}
                    </AppText>
                  </View>
                </React.Fragment>
              );
            })}
          </View>

          {step === 1 ? (
            <View style={[styles.card, styles.body]}>
              <AppText variant="h2" color={colors.text}>
                Verify Your Mobile Number
              </AppText>
              <AppText variant="body" color={colors.textLight}>
                Enter the mobile number registered with your housing application.
              </AppText>

              <FormInput
                label="REGISTERED MOBILE NUMBER"
                iconName="phone"
                prefix="+91"
                placeholder="Enter Mobile Number"
                keyboardType="number-pad"
                maxLength={10}
                value={values.mobileNumber}
                onChangeText={form.setMobileNumber}
                error={error}
                editable={!form.isChecking && !record}
                trailingIcon={record ? 'check-circle' : undefined}
                onSubmitEditing={form.verifyMobile}
              />

              {record ? (
                <>
                  <View style={styles.recordCard}>
                    <View style={styles.inline}>
                      <Feather name="check-circle" size={iconSize.sm} color={colors.success} />
                      <AppText variant="body" color={colors.success} style={styles.bold}>
                        Record Found & Verified
                      </AppText>
                    </View>
                    <AppText variant="caption" color={colors.textLight}>
                      APPLICATION NO
                    </AppText>
                    <AppText variant="body" color={colors.text} style={styles.bold}>
                      {record.applicationNo}
                    </AppText>
                  </View>
                  <Button title="Continue" onPress={form.goToPassword} size="lg" style={styles.button} />
                </>
              ) : (
                <Button
                  title="Verify"
                  onPress={form.verifyMobile}
                  size="lg"
                  loading={form.isChecking}
                  loadingText="Verifying..."
                  style={styles.button}
                />
              )}
            </View>
          ) : (
            <View style={[styles.card, styles.body]}>
              <View style={styles.infoPanel}>
                <View style={styles.flex}>
                  <AppText variant="caption" color={colors.textLight}>
                    APPLICATION NO
                  </AppText>
                  <AppText variant="body" color={colors.text} style={styles.bold}>
                    {record?.applicationNo}
                  </AppText>
                </View>
                <View style={styles.flex}>
                  <AppText variant="caption" color={colors.textLight}>
                    MOBILE
                  </AppText>
                  <AppText variant="body" color={colors.text} style={styles.bold}>
                    +91 {values.mobileNumber}
                  </AppText>
                </View>
              </View>

              <AppText variant="h2" color={colors.text}>
                Create Your Password
              </AppText>
              <AppText variant="body" color={colors.textLight}>
                Choose a strong password to protect your account.
              </AppText>

              <FormInput
                label="NEW PASSWORD"
                iconName="lock"
                placeholder="Enter new password"
                secureTextEntry={!form.showPassword}
                trailingIcon={form.showPassword ? 'eye-off' : 'eye'}
                onTrailingIconPress={form.togglePassword}
                value={values.password}
                onChangeText={form.setPassword}
                editable={!form.isRegistering}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <StrengthMeter strength={form.strength} />

              <FormInput
                label="CONFIRM PASSWORD"
                iconName="lock"
                placeholder="Re-enter password"
                secureTextEntry={!form.showPassword}
                value={values.confirmPassword}
                onChangeText={form.setConfirmPassword}
                error={error}
                editable={!form.isRegistering}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={form.register}
              />

              <Button
                title="Register"
                onPress={form.register}
                size="lg"
                disabled={!form.canRegister}
                loading={form.isRegistering}
                loadingText="Registering..."
                style={styles.button}
              />
            </View>
          )}

          <View style={[styles.inline, styles.loginRow]}>
            <AppText variant="body" color={colors.textLight}>
              Already registered?
            </AppText>
            <Pressable onPress={navigation.goBack} hitSlop={8} accessibilityRole="link">
              <AppText variant="body" color={colors.primary} style={styles.bold}>
                Log in
              </AppText>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
     
    </View>
  );
};

const StrengthMeter = memo(({ strength: { score, level, rules } }: { strength: PasswordStrength }) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: score,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [score, progress]);

  return (
    <View style={styles.meter}>
      <View style={styles.rowBetween}>
        <AppText variant="caption" color={colors.textLight}>
          Password strength
        </AppText>
        <AppText
          variant="caption"
          color={colors[level.tone]}
          style={styles.levelText}
          accessibilityLiveRegion="polite"
        >
          {level.label}
        </AppText>
      </View>

      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: progress.interpolate({ inputRange: [0, MAX_STRENGTH], outputRange: ['0%', '100%'] }),
              backgroundColor: progress.interpolate({
                inputRange: [0, 1, 2, 3, 4],
                outputRange: [colors.border, colors.error, colors.warning, colors.accent, colors.success],
              }),
            },
          ]}
        />
      </View>

      {rules.map(rule => (
        <View key={rule.label} style={styles.rule}>
          <Feather
            name={rule.met ? 'check-circle' : 'circle'}
            size={iconSize.xs}
            color={rule.met ? colors.success : colors.textLight}
          />
          <AppText variant="caption" color={rule.met ? colors.text : colors.textLight}>
            {rule.label}
          </AppText>
        </View>
      ))}
    </View>
  );
});

export default SignupScreen;

const createStyles = ({ spacing, colors, radius, shadow }: AppTheme) =>
  StyleSheet.create({
    flex: { flex: 1 },
    bold: { fontWeight: '700' },
    inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, gap: spacing.md },

    appBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    overline: { letterSpacing: 0.8 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      ...shadow.sm,
    },
    body: { padding: spacing.md, gap: spacing.xs },
    button: { alignSelf: 'stretch', marginTop: spacing.lg },

    stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
    stepBadge: {
      width: 28,
      height: 28,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    stepDone: { backgroundColor: colors.successLight, borderColor: colors.success },
    stepLine: { flex: 1, height: 2, backgroundColor: colors.border },
    stepLineDone: { backgroundColor: colors.success },

    recordCard: {
      gap: spacing.xs,
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.success,
      backgroundColor: colors.successLight,
    },
    infoPanel: {
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.background,
    },

    meter: {
      gap: spacing.sm,
      marginTop: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.background,
    },
    levelText: { fontWeight: '700', letterSpacing: 0.5 },
    track: { height: 6, borderRadius: radius.full, backgroundColor: colors.border, overflow: 'hidden' },
    fill: { height: '100%', borderRadius: radius.full },
    rule: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

    loginRow: { justifyContent: 'center' },
  });