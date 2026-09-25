import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { AppText } from '../../../components';
import { StatusPill } from './StatusPill';

type PillTone = 'success' | 'warning' | 'error' | 'neutral' | 'info';

interface WorkItemCardProps {
  code: string;
  status: string;
  statusTone: PillTone;
  icon: string;
  iconTone: PillTone;
  title: string;
  subtitle: string;
  progressLabel?: string;
  progressValue?: string;
  progress?: number;
  progressColor?: string;
  footerLeft?: string;
  footerRight?: string;
  footerRightTone?: PillTone;
  onPress?: () => void;
}

export const WorkItemCard: React.FC<WorkItemCardProps> = ({
  code,
  status,
  statusTone,
  icon,
  iconTone,
  title,
  subtitle,
  progressLabel,
  progressValue,
  progress,
  progressColor,
  footerLeft,
  footerRight,
  footerRightTone = 'neutral',
  onPress,
}) => {
  const { colors, iconSize } = useTheme();
  const styles = useThemedStyles(createStyles);

  const toneMap: Record<PillTone, string> = {
    success: colors.success,
    warning: colors.accent,
    error: colors.error,
    info: colors.primary,
    neutral: colors.secondary,
  };
  const toneBgMap: Record<PillTone, string> = {
    success: colors.successLight,
    warning: colors.warningLight,
    error: colors.errorLight,
    info: colors.infoLight,
    neutral: colors.neutralLight,
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: toneBgMap[iconTone] }]}>
          <Ionicons name={icon as any} size={iconSize.md} color={toneMap[iconTone]} />
        </View>
        <View style={styles.codeCol}>
          <AppText variant="caption" color={colors.textLight} style={styles.code}>
            {code}
          </AppText>
        </View>
        <StatusPill label={status} tone={statusTone} />
        <Ionicons name="chevron-forward" size={iconSize.sm} color={colors.secondary} style={styles.chevron} />
      </View>

      <AppText variant="body" color={colors.text} style={styles.title}>
        {title}
      </AppText>
      <AppText variant="caption" color={colors.textLight} style={styles.subtitle}>
        {subtitle}
      </AppText>

      {progress !== undefined && (
        <>
          <View style={styles.rowBetween}>
            <AppText variant="caption" color={colors.textLight}>
              {progressLabel}
            </AppText>
            <AppText variant="caption" color={colors.text} style={styles.progressValue}>
              {progressValue}
            </AppText>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${progress * 100}%`, backgroundColor: progressColor ?? colors.primary },
              ]}
            />
          </View>
        </>
      )}

      {(footerLeft || footerRight) && (
        <View style={[styles.rowBetween, styles.footerRow]}>
          {footerLeft ? (
            <AppText variant="caption" color={colors.textLight}>
              {footerLeft}
            </AppText>
          ) : (
            <View />
          )}
          {footerRight ? <StatusPill label={footerRight} tone={footerRightTone} /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = ({ spacing, colors, radius, shadow, iconSize }: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...shadow.sm,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    iconBox: {
      width: iconSize.xl,
      height: iconSize.xl,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm,
    },
    codeCol: {
      flex: 1,
    },
    code: {
      fontWeight: '700',
    },
    chevron: {
      marginLeft: spacing.xs,
    },
    title: {
      fontWeight: '700',
      marginBottom: spacing.xs / 2,
    },
    subtitle: {
      marginBottom: spacing.sm,
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    progressValue: {
      fontWeight: '700',
    },
    track: {
      height: spacing.xs,
      borderRadius: radius.sm,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: radius.sm,
    },
    footerRow: {
      marginTop: spacing.xs,
      marginBottom: 0,
    },
  });