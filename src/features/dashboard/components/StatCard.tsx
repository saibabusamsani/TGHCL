import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { AppText } from '../../../components';

interface StatCardProps {
  label: string;
  value: string | number;
  valueColor?: ColorValue;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  valueColor,
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <AppText variant="caption" color={colors.textLight} style={styles.label}>
        {label}
      </AppText>
      <AppText
        variant="h2"
        color={valueColor as string?? colors.text }
        style={styles.value}
      >
        {value}
      </AppText>
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, shadow }: AppTheme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      justifyContent: 'space-between',
      ...shadow.sm,
    },
    label: {
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.xs,
    },
    value: {
      fontWeight: '800',
    },
  });