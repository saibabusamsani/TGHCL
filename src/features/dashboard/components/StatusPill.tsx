import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { AppText } from '../../../components';

type PillTone = 'success' | 'warning' | 'error' | 'neutral' | 'info';

interface StatusPillProps {
  label: string;
  tone?: PillTone;
}

export const StatusPill: React.FC<StatusPillProps> = ({ label, tone = 'neutral' }) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const toneMap: Record<PillTone, { bg: string; fg: string }> = {
    success: { bg: colors.successLight, fg: colors.success },
    warning: { bg: colors.warningLight, fg: colors.accent },
    error: { bg: colors.errorLight, fg: colors.error },
    info: { bg: colors.infoLight, fg: colors.primary },
    neutral: { bg: colors.neutralLight, fg: colors.textLight },
  };

  const { bg, fg } = toneMap[tone];

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <AppText variant="caption" color={fg} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
};

const createStyles = ({ spacing, radius, typography }: AppTheme) =>
  StyleSheet.create({
    pill: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: radius.full,
      alignSelf: 'flex-start',
    },
    text: {
      fontWeight: '700',
      fontSize: typography.fontSize.sm,
      letterSpacing: spacing.xs / (spacing.xs * 3.33),
    },
  });