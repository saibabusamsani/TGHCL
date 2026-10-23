import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { LoginType, useLoginForm } from '../hooks/useLoginForm';
import { ScreenHeader } from '../components/ScreenHeader';
import { AppText, Button } from '../../../components';
import { FormInput } from '../components/FormInput';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigations/navigation.types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const LOGIN_TYPES: { type: LoginType; label: string; icon: string }[] = [
  { type: 'mobile', label: 'Mobile Number', icon: 'smartphone' },
  { type: 'employee', label: 'Employee ID', icon: 'user' },
];

const LoginScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();

  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const {
    formState,
    loginType,
    isLoading,
    updateField,
    changeLoginType,
    togglePasswordVisibility,
    submitForm,
  } = useLoginForm();

  const isMobile = loginType === 'mobile';

  return (
    <KeyboardAwareScrollView
      style={styles.flexOne}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={20}
    >
      <View style={styles.content}>
        <ScreenHeader />

        <View style={styles.formCard}>
          <View style={styles.formHandle} />

          <AppText variant="h2" style={styles.welcomeText}>
            Welcome back
          </AppText>
          <AppText variant="body" style={styles.welcomeSubtext}>
            {
              isMobile ? 'Sign in with your registered mobile number' : 'Sign in with your Employee ID'
            }
          </AppText>
          <View style={styles.segment} accessibilityRole="tablist">
            {LOGIN_TYPES.map((item) => {
              const active = loginType === item.type;
              return (
                <Pressable
                  key={item.type}
                  style={[styles.segmentItem, active && styles.segmentItemActive]}
                  onPress={() => changeLoginType(item.type)}
                  disabled={isLoading}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Sign in with ${item.label}`}
                >
                  <Feather
                    name={item.icon as any}
                    size={iconSize.xs}
                    color={active ? colors.primary : colors.textLight}
                  />
                  <AppText
                    variant="caption"
                    style={[styles.segmentText, active && styles.segmentTextActive]}
                  >
                    {item.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          <FormInput
            key={loginType}
            label={isMobile ? 'MOBILE NUMBER' : 'EMPLOYEE ID'}
            iconName={isMobile ? 'phone' : 'user'}
            prefix={isMobile ? '+91' : undefined}
            placeholder={isMobile ? 'Enter Mobile Number' : 'Enter Employee ID'}
            keyboardType={isMobile ? 'number-pad' : 'default'}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={isMobile ? 10 : 30}
            textContentType={isMobile ? 'telephoneNumber' : 'username'}
            value={formState.values.username}
            onChangeText={(val) => updateField('username', isMobile ? val.replace(/\D/g, '') : val)}
            error={formState.errors.username}
            editable={!isLoading}
          />

          {/* Password Field */}
          <FormInput
            label="PASSWORD"
            iconName="lock"
            placeholder="Enter your password"
            secureTextEntry={!formState.showPassword}
            trailingIcon={formState.showPassword ? 'eye-off' : 'eye'}
            onTrailingIconPress={togglePasswordVisibility}
            value={formState.values.password}
            onChangeText={(val) => updateField('password', val)}
            error={formState.errors.password}
            editable={!isLoading}
          />
          <Pressable
            onPress={() => { }}
          >
            <AppText variant="body" style={styles.forgotText}>
              Forgot Password?
            </AppText>
          </Pressable>


          <Button
            title="Sign In"
            onPress={submitForm}
            size="lg"
            loading={isLoading}
            loadingText="Signing in..."
            style={styles.signInBtn}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <AppText variant="caption" style={styles.dividerText}>
              or
            </AppText>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [styles.altBtn, pressed && styles.altBtnPressed]}
            onPress={() => navigation.navigate('Signup')}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sign in with OTP"
            android_ripple={{ color: colors.border }}
          >
            <Feather name="message-square" size={iconSize.sm} color={colors.primary} />
            <AppText variant="body" style={styles.altBtnText}>
              Sign in with OTP
            </AppText>
          </Pressable>

          <View style={styles.footerRow}>
            <Feather name="shield" size={iconSize.xs} color={colors.textLight} />
            <AppText variant="caption" style={styles.footerText}>
              Secure role-based access · TGHB Constructions
            </AppText>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

const createStyles = ({ spacing, colors, radius, shadow, typography, isLandscape, isTablet }: AppTheme) =>
  StyleSheet.create({
    flexOne: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      flexDirection: isLandscape ? 'row' : 'column',
    },
    formCard: {
      flex: isLandscape ? (isTablet ? 6 : 5) : undefined,
      backgroundColor: colors.surface,
      marginTop: isLandscape ? 0 : -spacing.xl,
      marginHorizontal: isLandscape ? 0 : spacing.md,
      borderRadius: radius.xl,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      alignSelf: isLandscape ? 'center' : undefined,
      width: isLandscape ? '100%' : undefined,
      maxWidth: isTablet || isLandscape ? 440 : undefined,
      justifyContent: isLandscape ? 'center' : undefined,
      ...shadow.lg,
    },
    formHandle: {
      alignSelf: 'center',
      width: spacing.xl,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      marginBottom: spacing.md,
      opacity: isLandscape ? 0 : 1,
    },
    welcomeText: {
      color: colors.text,
    },
    welcomeSubtext: {
      color: colors.textLight,
      marginTop: spacing.xs,
      marginBottom: spacing.md,
    },
    segment: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: radius.md,
      padding: spacing.xs / 2,
      gap: spacing.xs / 2,
    },
    segmentItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    segmentItemActive: {
      backgroundColor: colors.surface,
      ...shadow.sm,
    },
    segmentText: {
      color: colors.textLight,
      fontWeight: typography.fontWeight.medium,
    },
    segmentTextActive: {
      color: colors.primary,
      fontWeight: typography.fontWeight.bold,
    },
    forgotText: {
      color: colors.primary,
      fontWeight: '600',
      textAlign: 'right',
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
    },
    signInBtn: {
      alignSelf: 'stretch',
      justifyContent: 'center',
      ...shadow.md,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginVertical: spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    dividerText: {
      color: colors.textLight,
    },
    altBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      minHeight: 52,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },
    altBtnPressed: {
      backgroundColor: colors.infoLight,
    },
    altBtnText: {
      color: colors.primary,
      fontWeight: '700',
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
      gap: spacing.xs,
    },
    footerText: {
      color: colors.textLight,
      textAlign: 'center',
    },
  });