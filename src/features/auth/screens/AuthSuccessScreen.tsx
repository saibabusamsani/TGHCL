import React from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText, Button } from '../../../components';
import { AuthStackParamList } from '../../../navigations/navigation.types';
import { useAppDispatch } from '../../../store/hooks';
import { setUser } from '../../../store/authSlice';
import { useLogoutMutation } from '../auth.api';

type Props = NativeStackScreenProps<AuthStackParamList, 'LoginSuccess'>;

const AuthSuccessScreen = ({ route, navigation }: Props) => {
  const { loginDetails } = route.params;
  const { gradients } = useTheme();
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();

  const [logoutEmployee, { isLoading: isSigningOut }] = useLogoutMutation();

  const handleContinue = () => {
    dispatch(setUser(loginDetails))
  };


  const signOut = async () => {
    const result = await logoutEmployee(loginDetails.employeeId);
    if (!('error' in result)) {
      navigation.replace("Login");
    }
  };

  const handleSignOut = () =>
    Alert.alert('Sign out?', 'You will need to log in again to continue.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.body}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeRing}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <AppText variant="subtitle" style={styles.projectName}>
              Telangana Housing Board
            </AppText>

            <View style={styles.channelRow}>
              <View style={styles.channelLine} />
              <AppText variant="caption" style={styles.channel}>
                OFFICIAL CITIZEN CHANNEL
              </AppText>
              <View style={styles.channelLine} />
            </View>
          </View>

          <AppText variant="h2" style={styles.pageTitle}>
            Authentication Complete
          </AppText>

          {/* Banner */}
          <LinearGradient
            colors={[...gradients.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <LottieView
              source={require('../../../assets/lottie/success-animation.json')}
              autoPlay
              loop={false}
              resizeMode="contain"
              style={styles.lottie}
            />

            <View style={styles.sessionPill}>
              <View style={styles.sessionDot} />
              <AppText variant="caption" style={styles.sessionText}>
                SECURE SESSION
              </AppText>
            </View>

            <AppText variant="body" style={styles.welcomeLabel}>
              Welcome back,
            </AppText>
            <AppText variant="h2" numberOfLines={2} style={styles.welcomeName}>
              {loginDetails.employeeName}
            </AppText>
            <AppText variant="body" style={styles.welcomeSubtitle}>
              Identity verified successfully.
            </AppText>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.buttonWrap}>
            <Button title="Continue" onPress={handleContinue} />
          </View>

          <Pressable
            onPress={handleSignOut}
            disabled={isSigningOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            accessibilityState={{ disabled: isSigningOut }}
            style={styles.signOut}
          >
            {isSigningOut ? (
              <AppText variant="caption" style={styles.signOutHint}>
                Signing out…
              </AppText>
            ) : (
              <>
                <AppText variant="caption" style={styles.signOutHint}>
                  Not you?{' '}
                </AppText>
                <AppText variant="caption" style={styles.signOutLink}>
                  Sign out
                </AppText>
              </>
            )}
          </Pressable>

          <AppText variant="caption" style={styles.footerNote}>
            Your session is encrypted and secure
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = ({ spacing, colors, radius, typography, isTablet }: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    // isTablet = layout shape only
    container: {
      flex: 1,
      width: isTablet ? '60%' : '100%',
      paddingHorizontal: spacing.md,
    },
    body: {
      flex: 1,
    },

    // Header
    header: {
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    badgeRing: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      borderRadius: radius.full,
      padding: spacing.xs,
      marginBottom: spacing.sm,
    },
    logo: {
      width: spacing.xxl,
      height: spacing.xxl,
      borderRadius: radius.full,
    },
    projectName: {
      color: colors.text,
      fontSize: typography.fontSize.lg,
    },
    channelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    channelLine: {
      width: spacing.lg,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.accent,
    },
    channel: {
      color: colors.accent,
      marginHorizontal: spacing.sm,
    },
    pageTitle: {
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.md,
    },

    // Banner
    banner: {
      alignItems: 'center',
      borderRadius: radius.xl,
      overflow: 'hidden',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
    },
    lottie: {
      width: '70%',
      aspectRatio: 1,
    },
    sessionPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.chipBg,
      borderRadius: radius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.sm,
    },
    sessionDot: {
      width: spacing.xs,
      height: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.success,
      marginRight: spacing.xs,
    },
    sessionText: {
      color: colors.textInverse,
    },
    welcomeLabel: {
      color: colors.textInverse,
      textAlign: 'center',
    },
    welcomeName: {
      color: colors.textInverse,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    welcomeSubtitle: {
      color: colors.textInverse,
      textAlign: 'center',
    },

    // Footer
    footer: {
      alignItems: 'center',
      paddingBottom: spacing.lg,
    },
    buttonWrap: {
      width: '100%',
    },
    signOut: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    signOutHint: {
      color: colors.textLight,
    },
    signOutLink: {
      color: colors.primary,
    },
    footerNote: {
      color: colors.textLight,
      textAlign: 'center',
    },
  });

export default AuthSuccessScreen;