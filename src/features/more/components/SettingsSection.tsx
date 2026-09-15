import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components';
import Ionicons from '@react-native-vector-icons/ionicons';

interface SettingsRowProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress?: (e: GestureResponderEvent) => void;
  showDot?: boolean;
  rightElement?: ReactNode;
  isLast?: boolean;
}

export const SettingsRow = ({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  onPress,
  showDot,
  rightElement,
  isLast,
}: SettingsRowProps) => {
  const rowStyles = useThemedStyles(createRowStyles);
  const { colors, iconSize } = useTheme();

  return (
    <>
      <TouchableOpacity style={rowStyles.row} activeOpacity={0.6} onPress={onPress} disabled={!onPress}>
        <View style={[rowStyles.rowIconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon as any} size={iconSize.sm} color={iconColor} />
        </View>
        <View style={rowStyles.rowText}>
          <AppText variant="body" color={colors.text}>{title}</AppText>
          {subtitle && (
            <AppText variant="caption" color={colors.textLight}>{subtitle}</AppText>
          )}
        </View>
        {showDot && <View style={rowStyles.dot} />}
        {rightElement}
        <Ionicons
          name="chevron-forward"
          size={iconSize.sm}
          color={colors.border}
          style={rowStyles.chevronSpacing}
        />
      </TouchableOpacity>
      {!isLast && <View style={rowStyles.divider} />}
    </>
  );
};

interface SettingsSectionProps {
  label: string;
  children: ReactNode;
}

export const SettingsSection = ({ label, children }: SettingsSectionProps) => {
  const styles = useThemedStyles(createSectionStyles);
  const { colors } = useTheme();

  return (
    <>
      <AppText variant="caption" color={colors.textLight} style={styles.sectionLabel}>
        {label}
      </AppText>
      <View style={styles.sectionCard}>{children}</View>
    </>
  );
};

const createSectionStyles = ({ spacing, colors, radius, shadow }: AppTheme) =>
  StyleSheet.create({
    sectionLabel: {
      marginTop: spacing.xl,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.sm,
    },
  });

const createRowStyles = ({ spacing, colors, radius }: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    rowIconWrap: {
      width: spacing.xxl,
      height: spacing.xxl,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    rowText: {
      flex: 1,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: radius.full,
      backgroundColor: colors.error,
      marginRight: spacing.xs,
    },
    chevronSpacing: {
      marginLeft: spacing.sm,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginLeft: spacing.md + spacing.xxl + spacing.md,
    },
  });