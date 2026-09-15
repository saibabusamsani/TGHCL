import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components';

interface MilestoneSummaryCardProps {
  categoryLabel: string;
  contractValue: number;
  payablePercent: number;
  amountToRelease: number;
  onTime: boolean;
  dueDateLabel: string;
}

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const MilestoneSummaryCard: React.FC<MilestoneSummaryCardProps> = ({
  categoryLabel,
  contractValue,
  payablePercent,
  amountToRelease,
  onTime,
  dueDateLabel,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View>
      {onTime ? (
        <View style={styles.statusBanner}>
          <AppText variant="caption" style={styles.statusText}>{`✓ On time — milestone due ${dueDateLabel}.`}</AppText>
        </View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.accentBar} />
        <View style={styles.cardInner}>
          <View style={styles.row}>
            <AppText variant="caption" style={styles.rowLabel}>Milestone Share</AppText>
            <View style={styles.badge}>
              <AppText variant="caption" style={styles.badgeText}>{categoryLabel}</AppText>
            </View>
          </View>

          <View style={styles.row}>
            <AppText variant="caption" style={styles.rowLabel}>Contract Value</AppText>
            <AppText variant="body" style={styles.rowValueBold}>{formatCurrency(contractValue)}</AppText>
          </View>

          <View style={styles.row}>
            <AppText variant="caption" style={styles.rowLabel}>% Payable on this Milestone</AppText>
            <AppText variant="body" style={styles.rowValueBold}>{payablePercent}%</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <AppText variant="subtitle" style={styles.totalLabel}>Amount to be Released</AppText>
            <AppText variant="subtitle" style={styles.totalValue}>{formatCurrency(amountToRelease)}</AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = ({ spacing, colors, radius }: AppTheme) =>
  StyleSheet.create({
    statusBanner: {
      backgroundColor: colors.successLight,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.success,
    },
    statusText: { color: colors.success, fontWeight: '600' },
    card: {
      flexDirection: 'row',
      backgroundColor: colors.ledgerBg,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    accentBar: {
      width: spacing.xs,
      backgroundColor: colors.accent,
    },
    cardInner: {
      flex: 1,
      padding: spacing.md,
    },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
    rowLabel: { color: colors.textLight },
    rowValueBold: { color: colors.primaryDark, fontWeight: '700' },
    badge: {
      backgroundColor: colors.infoLight,
      borderRadius: radius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    badgeText: { color: colors.primary, fontWeight: '700' },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, marginVertical: spacing.sm },
    totalLabel: { color: colors.primaryDark, fontWeight: '600' },
    totalValue: { color: colors.accent, fontWeight: '800' },
  });