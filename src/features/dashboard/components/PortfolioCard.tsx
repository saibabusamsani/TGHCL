import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { AppText } from '../../../components';

interface PortfolioCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  dotColor: string;
  progress?: number;
  progressColor?: string;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  label,
  value,
  sublabel,
  dotColor,
  progress,
  progressColor,
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <AppText variant="caption" color={colors.textLight} style={styles.label}>
          {label}
        </AppText>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      </View>

      <AppText variant="h1" color={colors.text} style={styles.value}>
        {value}
      </AppText>

      <View style={styles.footerRow}>
        <AppText variant="caption" color={colors.textLight}>
          {sublabel}
        </AppText>
      </View>

      {progress !== undefined && (
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                backgroundColor: progressColor ?? colors.primary,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, shadow, iconSize,typography }: AppTheme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      ...shadow.sm,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    label: {
      fontWeight:typography.fontWeight.bold,
      textTransform: 'uppercase',
      letterSpacing: spacing.xs / spacing.xs,
      flexShrink: 1,
    },
    dot: {
      width: iconSize.xs/2,
      height: iconSize.xs/2,
      borderRadius: radius.full,
      marginLeft: spacing.xs,
    },
    value: {
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xs / 2,
    },
    footerRow: {
      marginBottom: spacing.sm,
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
  });