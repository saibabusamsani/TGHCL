import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { formatINR } from '../../../utils';
import { PaymentStage, StageStatus } from '../../projects/project.type';
import { Shimmer } from '../../../components/Skeleton';


interface StageRowProps {
  stage: PaymentStage;
  isLast: boolean;
  isPaying: boolean;
  disabled: boolean;
  onPay: () => void;
}

export const StageRow: React.FC<StageRowProps> = ({ stage, isLast, isPaying, disabled, onPay }) => {
  const styles = useThemedStyles(createStyles(stage.status));
  const isCurrent = stage.status === 'current';

  return (
    <View style={styles.row}>
      {isCurrent && <View style={styles.activeBar} />}

      <View style={styles.rail}>
        <View style={styles.circle}>
          <AppText variant="subtitle" style={styles.circleText}>
            {stage.status === 'paid' ? '✓' : stage.number}
          </AppText>
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.info}>
            <AppText variant="caption" style={styles.stageLabel}>
              Stage {stage.number}
            </AppText>
            <AppText variant="subtitle">{stage.title}</AppText>
            <View style={styles.amount}>
              <Shimmer width={110} height={12}>
                <AppText variant="caption" style={styles.amountText}>
                  {stage.paid > 0 && stage.due > 0
                    ? `${formatINR(stage.paid)} paid of ${formatINR(stage.amount)}`
                    : formatINR(stage.amount)}
                </AppText>
              </Shimmer>
            </View>
          </View>

          <Shimmer width={72} height={22}>
            <View style={styles.chip}>
              <AppText variant="caption" style={styles.chipText}>
                {stage.status === 'paid'
                  ? 'Paid'
                  : isCurrent
                  ? `${formatINR(stage.due)} due`
                  : 'Upcoming'}
              </AppText>
            </View>
          </Shimmer>
        </View>

        {isCurrent && (
          <Button
            title="Pay now"
            size="lg"
            loading={isPaying}
            disabled={disabled}
            loadingText="Opening secure checkout..."
            onPress={onPay}
            style={styles.payButton}
          />
        )}
      </View>
    </View>
  );
};

const createStyles =
  (status: StageStatus) =>
  ({ spacing, colors, radius, iconSize, typography }: AppTheme) => {
    const isPaid = status === 'paid';
    const isCurrent = status === 'current';
    const isUpcoming = status === 'upcoming';

    return StyleSheet.create({
      row: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        backgroundColor: isCurrent ? colors.warningLight : colors.surface,
      },
      activeBar: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: spacing.xs,
        backgroundColor: colors.warning,
      },
      rail: {
        alignItems: 'center',
        paddingTop: spacing.md,
        marginRight: spacing.md,
      },
      circle: {
        width: iconSize.xl,
        height: iconSize.xl,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isPaid ? colors.success : isCurrent ? colors.warning : colors.surface,
        borderWidth: isUpcoming ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.border,
      },
      circleText: {
        color: isUpcoming ? colors.textLight : colors.white,
      },
      line: {
        flex: 1,
        width: spacing.xs / 2,
        marginTop: spacing.xs,
        borderRadius: radius.full,
        backgroundColor: isPaid ? colors.success : colors.border,
      },
      body: {
        flex: 1,
        paddingVertical: spacing.md,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      },
      info: {
        flex: 1,
        marginRight: spacing.sm,
      },
      stageLabel: {
        color: colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: spacing.xs / 4,
      },
      amount: {
        marginTop: spacing.xs / 2,
      },
      amountText: {
        fontWeight: typography.fontWeight.medium,
        color: isUpcoming ? colors.textLight : colors.text,
      },
      chip: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.full,
        backgroundColor: isPaid
          ? colors.successLight
          : isCurrent
          ? colors.surface
          : colors.neutralLight,
        borderWidth: isCurrent ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.warning,
      },
      chipText: {
        fontWeight: typography.fontWeight.medium,
        color: isPaid ? colors.success : isCurrent ? colors.warning : colors.textLight,
      },
      payButton: {
        alignSelf: 'stretch',
        marginTop: spacing.md,
      },
    });
  };