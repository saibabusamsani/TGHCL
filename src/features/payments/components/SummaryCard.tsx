import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components/AppText';
import { formatINR } from '../../../utils';
import { PaymentStage } from '../../projects/project.type';
import { Shimmer } from '../../../components/Skeleton';

interface SummaryCardProps {
  total: number;
  totalPaid: number;
  outstanding: number;
  stages: PaymentStage[];
  currentStage?: PaymentStage;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  total,
  totalPaid,
  outstanding,
  stages,
  currentStage,
}) => {
  const { gradients } = useTheme();
  const styles = useThemedStyles(createStyles);
  const percentPaid = total ? Math.round((totalPaid / total) * 100) : 0;

  return (
    <View style={styles.shadow}>
      <LinearGradient
        colors={[...gradients.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.circle} />

        <AppText variant="caption" style={[styles.inverse, styles.label]}>
          Total outstanding
        </AppText>
        <View style={styles.amount}>
          <Shimmer width="55%" height={32} onPrimary>
            <AppText variant="h1" style={styles.inverse}>
              {formatINR(outstanding)}
            </AppText>
          </Shimmer>
        </View>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentPaid}%` }]} />
        </View>

        <View style={styles.row}>
          <Shimmer width={56} height={12} onPrimary>
            <AppText variant="caption" style={styles.inverse}>
              {percentPaid}% paid
            </AppText>
          </Shimmer>
          <Shimmer width={120} height={12} onPrimary>
            <AppText variant="caption" style={styles.inverse}>
              {formatINR(totalPaid)} / {formatINR(total)}
            </AppText>
          </Shimmer>
        </View>

        <View style={[styles.row, styles.footer]}>
          <Shimmer width={140} height={24} onPrimary>
            <View style={styles.chip}>
              <AppText variant="caption" style={styles.chipText}>
                {currentStage
                  ? `Stage ${currentStage.number} · ${formatINR(currentStage.due)} due`
                  : 'All stages paid'}
              </AppText>
            </View>
          </Shimmer>
          <Shimmer width={110} height={12} onPrimary>
            <AppText variant="caption" style={styles.inverse}>
              {stages.filter(stage => stage.status === 'paid').length} of {stages.length} stages
              completed
            </AppText>
          </Shimmer>
        </View>
      </LinearGradient>
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, shadow, iconSize, typography }: AppTheme) =>
  StyleSheet.create({
    shadow: {
      borderRadius: radius.xl,
      backgroundColor: colors.primary,
      ...shadow.lg,
    },
    card: {
      padding: spacing.lg,
      borderRadius: radius.xl,
      overflow: 'hidden',
    },
    circle: {
      position: 'absolute',
      top: -spacing.xl,
      right: -spacing.lg,
      width: iconSize.xl * 4,
      height: iconSize.xl * 4,
      borderRadius: radius.full,
      backgroundColor: colors.chipBg,
    },
    inverse: {
      color: colors.textInverse,
    },
    label: {
      textTransform: 'uppercase',
      letterSpacing: spacing.xs / 4,
    },
    amount: {
      marginTop: spacing.xs,
    },
    track: {
      height: spacing.xs,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.chipBg,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: radius.full,
      backgroundColor: colors.accent,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    footer: {
      marginTop: spacing.md,
    },
    chip: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      backgroundColor: colors.chipBg,
    },
    chipText: {
      color: colors.accent,
      fontWeight: typography.fontWeight.medium,
    },
  });