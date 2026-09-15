import { View, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { AppTheme, typography, useTheme, useThemedStyles } from '../../theme';
import { AppText, Button } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useLogoutEmployeeMutation } from '../../api/rtk/auth.api';
import { storageHelper } from '../../utils';
import { STORAGE_KEYS } from '../../constants';
import { useAppDispatch } from '../../store/hooks';
import { clearUser } from '../../store/authSlice';
import { SettingsRow, SettingsSection } from './components/SettingsSection';

const MoreScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const dispatch = useAppDispatch();

  const [logoutEmployee, { isLoading }] = useLogoutEmployeeMutation();

  const handleLogout = async () => {
    logoutEmployee()
      .then(() => {
        storageHelper.remove(STORAGE_KEYS.USER_DATA);
        dispatch(clearUser());
      })
  }

  return (
    <View style={styles.container}>
      <AppText variant="h1" color={colors.text} style={styles.title}>More</AppText>

      <ScrollView contentContainerStyle={styles.scroll}>

      <View style={styles.profileCard}>
        <LinearGradient
          colors={[colors.avatarBackground, colors.primaryDark] as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <AppText variant="subtitle" color={colors.white} style={styles.avatarText}>SB</AppText>
        </LinearGradient>
        <View style={styles.profileInfo}>
          <AppText variant="body" color={colors.text} style={styles.profileName}>Sri Balaji Constructions</AppText>
          <View style={styles.profileMetaRow}>
            <View style={styles.badge}>
              <AppText variant="caption" color={colors.primary} style={styles.badgeText}>Contractor</AppText>
            </View>
            <AppText variant="caption" color={colors.textLight}>+91 91234 56780</AppText>
          </View>
        </View>
      </View>

      <SettingsSection label="WORK">
        <SettingsRow
          icon="business"
          iconColor={colors.tileIcon}
          iconBg={colors.tileBackground}
          title="All Projects"
          subtitle="Assigned to you"
        />
        <SettingsRow
          icon="receipt"
          iconColor={colors.accent}
          iconBg={colors.tileBackground}
          title="Bills & Payments"
          subtitle="Track submission & approval"
          isLast
        />
      </SettingsSection>

      <SettingsSection label="ACCOUNT">
        <SettingsRow
          icon="notifications"
          iconColor={colors.error}
          iconBg={colors.errorLight}
          title="Notifications"
          subtitle="Updates & alerts"
          showDot
          isLast
        />
      </SettingsSection>

      <Button
        title="Log Out"
        onPress={handleLogout}
        gradient="error"
        size="md"
        loading={isLoading}
        loadingText="Logging out…"
        icon={<Ionicons name="log-out-outline" size={iconSize.sm} color={colors.white} />}
        iconPosition="left"
        style={styles.logoutBtn}
      />

      <View style={styles.footer}>
        <AppText variant="caption" color={colors.textLight}>Sri Balaji Constructions · v1.0.0</AppText>
      </View>
      </ScrollView>

    </View>
  )
}

export default MoreScreen;

const createStyles = ({ spacing, colors, radius, shadow, typography, isLandscape, isTablet }: AppTheme) => {
  const constrained = isLandscape || isTablet;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.background,
    },
    scroll: {
      width: constrained ? 500 : undefined,
      alignSelf: constrained ? "center" : undefined
    },
    title: {
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      letterSpacing: -0.5,
      fontWeight: typography.fontWeight.semibold,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.sm,
    },
    avatar: {
      width: spacing.xxl + spacing.xs,
      height: spacing.xxl + spacing.xs,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    avatarText: {
      fontWeight: typography.fontWeight.semibold,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.xs,
    },
    profileMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    badge: {
      backgroundColor: colors.tileBackground,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
    },
    badgeText: {
      fontWeight: typography.fontWeight.semibold,
    },
    logoutBtn: {
      width: '100%',
      alignSelf: 'stretch',
      justifyContent: 'center',
      marginTop: spacing.xl,
      ...shadow.sm,
    },
    footer: {
      alignItems: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
  });
}