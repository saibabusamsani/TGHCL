import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { AppText } from '../../../components';
import { StatusPill } from './StatusPill';

interface LedgerCardProps {
  sanctionedValue: string;
  worksBound: string;
  committedValue: string;
  committedPct: number;
  disbursedPct: number;
  escrowPct: number;
  unbilledPct: number;
  disbursedAmount: string;
  pendingAmount: string;
  disbursedBillCount: number;
  pendingBillCount: number;
}

export const LedgerCard: React.FC<LedgerCardProps> = ({
  sanctionedValue,
  worksBound,
  committedValue,
  committedPct,
  disbursedPct,
  escrowPct,
  unbilledPct,
  disbursedAmount,
  pendingAmount,
  disbursedBillCount,
  pendingBillCount,
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerBar} />
          <View style={styles.headerTextCol}>
            <AppText variant="body" color={colors.text} style={styles.title}>
              TREASURY & FISCAL LEDGER
            </AppText>
            <AppText variant="caption" color={colors.textLight}>
              Under TS PWD Code & PFMS Norms
            </AppText>
          </View>
        </View>
        <StatusPill label="PFMS Validated" tone="info" />
      </View>

      <View style={styles.innerPanel}>
        <View style={styles.rowBetween}>
          <AppText variant="caption" color={colors.textLight} style={styles.label}>
            SANCTIONED CONTRACT VALUE
          </AppText>
          <AppText variant="caption" color={colors.textLight}>
            {worksBound}
          </AppText>
        </View>
        <AppText variant="h1" color={colors.text} style={styles.bigValue}>
          {sanctionedValue}
        </AppText>

        <View style={[styles.rowBetween, styles.realizationRow]}>
          <AppText variant="caption" color={colors.textLight}>
            Fiscal Realization: {committedValue} Committed
          </AppText>
          <AppText variant="caption" color={colors.text} style={styles.pctText}>
            {committedPct}%
          </AppText>
        </View>

        <View style={styles.track}>
          <View style={[styles.segment, { width: `${disbursedPct}%`, backgroundColor: colors.success }]} />
          <View style={[styles.segment, { width: `${escrowPct}%`, backgroundColor: colors.accent }]} />
          <View style={[styles.segment, { width: `${unbilledPct}%`, backgroundColor: colors.border }]} />
        </View>

        <View style={styles.legendRow}>
          <LegendDot color={colors.success} label={`Disbursed ${disbursedPct}%`} />
          <LegendDot color={colors.accent} label={`In Escrow ${escrowPct}%`} />
          <LegendDot color={colors.border} label={`Unbilled ${unbilledPct}%`} textColor={colors.textLight} />
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.successLight }]}>
          <View style={styles.rowBetween}>
            <AppText variant="caption" color={colors.success} style={styles.summaryLabel}>
              DISBURSED (PFMS)
            </AppText>
            <StatusPill label={`${disbursedBillCount} Bill`} tone="success" />
          </View>
          <AppText variant="h2" color={colors.text} style={styles.summaryValue}>
            {disbursedAmount}
          </AppText>
          <AppText variant="caption" color={colors.success}>
            ✓ Credited to SBI A/c
          </AppText>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.warningLight }]}>
          <View style={styles.rowBetween}>
            <AppText variant="caption" color={colors.accent} style={styles.summaryLabel}>
              PENDING RELEASE
            </AppText>
            <StatusPill label={`${pendingBillCount} Bills`} tone="warning" />
          </View>
          <AppText variant="h2" color={colors.text} style={styles.summaryValue}>
            {pendingAmount}
          </AppText>
          <AppText variant="caption" color={colors.accent}>
            ● Stage-2 Audit Escrow
          </AppText>
        </View>
      </View>
    </View>
  );
};

const LegendDot: React.FC<{ color: string; label: string; textColor?: string }> = ({
  color,
  label,
  textColor,
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <AppText variant="caption" color={textColor ?? colors.textLight}>
        {label}
      </AppText>
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, shadow, iconSize ,typography}: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadow.sm,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexShrink: 1,
      marginRight: spacing.sm,
    },
    headerTextCol: {
      flexShrink: 1,
    },
    headerBar: {
      width: iconSize.xs / 2,
      height: iconSize.lg,
      borderRadius: radius.sm,
      backgroundColor: colors.primary,
      marginRight: spacing.xs,
    },
    title: {
      fontWeight: '800',
      letterSpacing: spacing.xs / (spacing.xs * 3.33),
    },
    innerPanel: {
      backgroundColor: colors.ledgerBg,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontWeight: typography.fontWeight.bold,
      letterSpacing: spacing.xs / (spacing.xs * 2.5),
    },
    bigValue: {
      fontWeight: '800',
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },
    realizationRow: {
      marginBottom: spacing.xs,
    },
    pctText: {
       fontWeight: typography.fontWeight.bold,
    },
    track: {
      flexDirection: 'row',
      height: spacing.xs,
      borderRadius: radius.sm,
      overflow: 'hidden',
      backgroundColor: colors.border,
      marginBottom: spacing.xs,
    },
    segment: {
      height: '100%',
    },
    legendRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: iconSize.xs/2,
      height: iconSize.xs/2,
      borderRadius: radius.full,
      marginRight: spacing.xs / 2,
    },
    gridRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    summaryCard: {
      flex: 1,
      borderRadius: radius.md,
      padding: spacing.sm,
    },
    summaryLabel: {
       fontWeight: typography.fontWeight.semibold,
      letterSpacing: spacing.xs / (spacing.xs * 3.33),
      flexShrink: 1,
    },
    summaryValue: {
       fontWeight: typography.fontWeight.bold,
      marginVertical: spacing.xs / 2,
    },
  });