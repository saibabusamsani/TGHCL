import React from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppTheme, useTheme, useThemedStyles } from '../../theme';
import { AppText } from '../../components';
import { useLogoutMutation } from '../auth/auth.api';
import { SettingsRow, SettingsSection } from './components/SettingsSection';
import { useAppSelector } from '../../store/hooks';
import { getInitials } from '../../utils';

const ProfileScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const user = useAppSelector(state => state.authentication.user);
  const [logout, { isLoading }] = useLogoutMutation();


  const confirmLogout = () =>
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);

  return (
    <View style={styles.container}>
      <AppText variant="h1" color={colors.text} style={styles.title}>
        Profile
      </AppText>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {user?.employeeName ? (
              <AppText variant="subtitle" color={colors.textInverse} style={styles.semibold}>
                { getInitials(user.employeeName)}
              </AppText>
            ) : (
              <Ionicons name="person" size={iconSize.md} color={colors.textInverse} />
            )}
          </View>
          <View style={styles.profileInfo}>
            <AppText variant="body" color={colors.text} style={styles.semibold} numberOfLines={1}>
              {user?.employeeName || 'User'}
            </AppText>
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <AppText variant="caption" color={colors.primary} style={styles.semibold}>
                  Beneficiary
                </AppText>
              </View>
              <AppText variant="caption" color={colors.textLight}>
                +91 {user?.mobileNumber}
              </AppText>
            </View>
          </View>
        </View>


        {
          user?.designationId !== 2 &&
          <SettingsSection label="WORK">
            <SettingsRow  icon="business-outline" title="All Projects" subtitle="Assigned to you" />
            <SettingsRow
              icon="receipt-outline"
              title="Bills & Payments"
              subtitle="Track submission & approval"
              isLast
            />
          </SettingsSection>

        }


        <SettingsSection label="ACCOUNT">
          <SettingsRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Updates & alerts"
            showDot
            isLast
          />
        </SettingsSection>

        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutPressed]}
          onPress={confirmLogout}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          android_ripple={{ color: colors.errorLight }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.error} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={iconSize.lg} color={colors.error} />
              <AppText variant="body" color={colors.error} style={styles.semibold}>
                Log Out
              </AppText>
            </>
          )}
        </Pressable>

        <AppText variant="caption" color={colors.textLight} style={styles.footer}>
          Sri Balaji Constructions · v1.0.0
        </AppText>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const createStyles = ({ spacing, colors, radius, shadow, typography, isLandscape, isTablet }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.background,
    },
    scroll: {
      width: isLandscape || isTablet ? 500 : undefined,
      alignSelf: isLandscape || isTablet ? 'center' : undefined,
      paddingBottom: spacing.xl,
    },
    title: {
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      letterSpacing: -0.5,
      fontWeight: typography.fontWeight.semibold,
    },
    semibold: { fontWeight: typography.fontWeight.semibold },

    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...shadow.sm,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    profileInfo: { flex: 1, gap: spacing.xs },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
      backgroundColor: colors.infoLight,
    },

    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      minHeight: 52,
      marginTop: spacing.xl,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.error,
      backgroundColor: colors.surface,
    },
    logoutPressed: { backgroundColor: colors.errorLight },
    footer: {
      textAlign: 'center',
      marginTop: spacing.lg,
    },
  });