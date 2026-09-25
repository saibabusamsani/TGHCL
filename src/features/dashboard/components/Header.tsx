import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { AppText } from '../../../components';

interface HeaderProps {
  companyName: string;
  classLabel?: string;
  contractorId: string;
  verified?: boolean;
  syncedAt: string;
  ledgerLocked?: boolean;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  companyName,
  classLabel,
  contractorId,
  verified = true,
  syncedAt,
  ledgerLocked = true
}) => {
  const { colors, iconSize, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBand}>
        <View style={styles.topBandLeft}>
          <View style={styles.shieldBox}>
            <Ionicons name="shield-checkmark" size={iconSize.md} color={colors.primary} />
          </View>
          <View style={styles.orgTextCol}>
            <AppText variant="caption" color={isDark ? colors.accent : colors.textInverse} style={styles.orgLine}>
              GOVT. OF TELANGANA
            </AppText>
            <AppText variant="body" color={colors.textInverse} style={styles.orgTitle}>
              TGHCL Works Management Portal
            </AppText>
          </View>
        </View>
        <View style={styles.liveChip}>
          <View style={styles.liveDot} />
          <AppText variant="caption" color={colors.textInverse} style={styles.liveText}>
            LIVE PFMS AUDIT
          </AppText>
        </View>
      </View>

      <View style={styles.companyRow}>
        <View style={styles.companyLeft}>
          <AppText variant="h2" color={colors.textInverse} style={styles.companyName}>
            {companyName}
          </AppText>
          {classLabel ? (
            <View style={styles.classPill}>
              <AppText variant="caption" color={colors.textInverse} style={styles.classText}>
                {classLabel}
              </AppText>
            </View>
          ) : null}
        </View>
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="wifi" size={iconSize.sm} color={colors.textInverse} />
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={iconSize.sm} color={colors.textInverse} />
            <View style={styles.badgeDot} />
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <AppText variant="caption" color={colors.textInverse} style={styles.metaText}>
          ID: {contractorId}
        </AppText>
        {verified && (
          <>
            <AppText variant="caption" color={colors.textInverse}> · </AppText>
            <Ionicons name="checkmark-circle" size={iconSize.xs} color={colors.success} />
            <AppText variant="caption" color={colors.textInverse} style={styles.verifiedText}>
              {' '}Verified Seal
            </AppText>
          </>
        )}
      </View>

      <View style={styles.syncRow}>
        <View style={styles.syncLeft}>
          <Ionicons name="time-outline" size={iconSize.sm} color={colors.textLight} />
          <AppText variant="caption" color={colors.textLight} style={styles.syncText}>
            Synced: {syncedAt}
          </AppText>
        </View>
        {ledgerLocked && (
          <View style={styles.lockedPill}>
            <Ionicons name="lock-closed" size={iconSize.xs} color={colors.primary} />
            <AppText variant="caption" color={colors.primary} style={styles.lockedText}>
              {' '}PFMS LEDGER LOCKED
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, iconSize,typography }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.primaryDark,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      borderBottomLeftRadius: radius.lg,
      borderBottomRightRadius: radius.lg,
      marginBottom: spacing.md,
    },
    topBand: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    topBandLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
      marginRight: spacing.sm,
    },
    shieldBox: {
      width: iconSize.xl,
      height: iconSize.xl,
      borderRadius: radius.sm,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm,
    },
    orgTextCol: {
      flex: 1,
    },
    orgLine: {
      fontWeight: typography.fontWeight.bold,
      letterSpacing: spacing.xs / (spacing.xs * 2),
      opacity: spacing.sm / spacing.md,
    },
    orgTitle: {
      fontWeight: typography.fontWeight.bold,
    },
    liveChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.chipBg,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
    },
    liveDot: {
      width: iconSize.xs/2,
      height: iconSize.xs/2,
      borderRadius: radius.full,
      backgroundColor: colors.success,
      marginRight: spacing.xs / 2,
    },
    liveText: {
      fontWeight:typography.fontWeight.bold,
      lineHeight: spacing.md,
    },
    companyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    companyLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      marginRight: spacing.sm,
    },
    companyName: {
      fontWeight: typography.fontWeight.bold,
      marginRight: spacing.xs,
    },
    classPill: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: radius.full,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs / 2,
    },
    classText: {
      fontWeight: typography.fontWeight.bold,
    },
    iconRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    iconCircle: {
      width: iconSize.xl,
      height: iconSize.xl,
      borderRadius: radius.full,
      backgroundColor: colors.chipBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeDot: {
      position: 'absolute',
      top: spacing.xs,
      right: spacing.xs,
      width: iconSize.xs/2,
      height: iconSize.xs/2,
      borderRadius: radius.full,
      backgroundColor: colors.warning,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    metaText: {
      opacity: spacing.sm / spacing.md,
    },
    verifiedText: {
      opacity: spacing.sm / spacing.md,
    },
    syncRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      marginTop: spacing.xs,
    },
    syncLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    syncText: {
      marginLeft: spacing.xs,
    },
    lockedPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.infoLight,
      borderRadius: radius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
    },
    lockedText: {
      fontWeight: typography.fontWeight.bold,
    },
  });