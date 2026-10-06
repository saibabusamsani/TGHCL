import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message';

import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { useAppSelector } from '../../../store/hooks';
import { formatINR } from '../../../utils';
import { useGetBeneficiaryDetailsQuery } from '../../projects/projects.api';
import { usePayUCheckout } from '../hooks/usePayUCheckout';
import {
  PaymentStage,
  StageAllocation,
  StageStatus,
  usePaymentTimeline,
} from '../hooks/usePaymentTimeline';


type Summary = ReturnType<typeof usePaymentTimeline>['summary'];

const toAmount = (text: string) => Number(text) || 0;

// "1500000.5" -> "15,00,000.5" (Indian grouping, keeps typed decimals)
const formatAmountInput = (raw: string) => {
  const [whole, decimals] = raw.split('.');
  const grouped = whole.replace(/\B(?=(\d\d)+\d(?!\d))/g, ',');
  return decimals === undefined ? grouped : `${grouped}.${decimals}`;
};

export const PaymentScreen: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const user = useAppSelector(state => state.authentication.user);
  const { data: beneficiaryList } = useGetBeneficiaryDetailsQuery();
  const beneficiary = beneficiaryList?.[0];
  const { stages, summary, previewPayment, applyPayment } = usePaymentTimeline();

  const currentStage = stages.find(stage => stage.status === 'current');
  const [amountText, setAmountText] = useState('');
  const [payingFrom, setPayingFrom] = useState<'stage' | 'custom' | null>(null);
  const pendingAmountRef = useRef(0);

  const { startPayment, isProcessing } = usePayUCheckout({
    onComplete: result => {
      if (result === 'SUCCESS') {
        applyPayment(pendingAmountRef.current);
        setAmountText('');
      }
      pendingAmountRef.current = 0;
      setPayingFrom(null);
    },
  });

  const payAmount = (amount: number, from: 'stage' | 'custom') => {
    const applicationNo = beneficiary?.applicationNo;

    if (!applicationNo) {
      Toast.show({ type: 'error', text1: 'Beneficiary details not loaded', text2: 'Please try again.' });
      return;
    }

    pendingAmountRef.current = amount;
    setPayingFrom(from);
    startPayment({
      amount,
      applicationNo,
      email: user?.email ?? "test@gmail.com",
    });
  };

  return (
    <View style={styles.safe}>


      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="h1">Payments</AppText>
        <AppText variant="subtitle" style={styles.muted}>
          {beneficiary?.project ?? '-'} · VID {beneficiary?.virtualAccount ?? '-'}
        </AppText>

        <SectionTitle title="Payment summary" />
        <SummaryCard summary={summary} />

        <View style={styles.tilesRow}>
          <StatTile label="Total cost" value={summary.totalCostLabel} />
          <StatTile label="Paid" value={summary.paidLabel} positive />
        </View>

        <SectionTitle title="Payment stages" />
        <View style={[styles.card, styles.stagesCard]}>
          {stages.map((stage, index) => (
            <StageRow
              key={stage.key}
              stage={stage}
              isLast={index === stages.length - 1}
              isPaying={isProcessing && payingFrom === 'stage'}
              disabled={isProcessing}
              onPay={() => payAmount(stage.due, 'stage')}
            />
          ))}
        </View>

        {currentStage && (
          <>
            <SectionTitle title="Make a payment" />
            <CustomPaymentCard
              amountText={amountText}
              onChangeAmount={setAmountText}
              currentStage={currentStage}
              outstanding={summary.outstanding}
              previewPayment={previewPayment}
              virtualAccount={beneficiary?.virtualAccount}
              isPaying={isProcessing && payingFrom === 'custom'}
              disabled={isProcessing}
              onPay={amount => payAmount(amount, 'custom')}
            />
          </>
        )}

        <AppText variant="caption" style={[styles.muted, styles.footerNote]}>
          Payments are processed securely through PayU. A receipt is issued after every successful
          payment.
        </AppText>
      </ScrollView>
    </View>
  );
};
const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionBar} />
      <AppText variant="subtitle" style={styles.sectionText}>
        {title}
      </AppText>
    </View>
  );
};

const SummaryCard: React.FC<{ summary: Summary }> = ({ summary }) => {
  const { gradients } = useTheme();
  const styles = useThemedStyles(createStyles);
  const progress = useThemedStyles(createProgressStyles(summary.percentPaid));

  return (
    <View style={styles.summaryShadow}>
      <LinearGradient
        colors={gradients.primary as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryCircle} />

        <AppText variant="caption" style={[styles.inverse, styles.summaryLabel]}>
          Total outstanding
        </AppText>
        <AppText variant="h1" style={styles.inverse}>
          {summary.outstandingLabel}
        </AppText>

        <View style={progress.track}>
          <View style={progress.fill} />
        </View>

        <View style={styles.spaceBetween}>
          <AppText variant="caption" style={styles.inverse}>
            {summary.percentPaid}% paid
          </AppText>
          <AppText variant="caption" style={styles.inverse}>
            {summary.progressLabel}
          </AppText>
        </View>

        <View style={[styles.spaceBetween, styles.summaryFooter]}>
          <View style={styles.nextDueChip}>
            <AppText variant="caption" style={styles.nextDueText}>
              {summary.nextDueLabel}
            </AppText>
          </View>
          <AppText variant="caption" style={styles.inverse}>
            {summary.stagesDoneLabel}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
};

const StatTile: React.FC<{ label: string; value: string; positive?: boolean }> = ({
  label,
  value,
  positive = false,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, styles.tile]}>
      <AppText variant="caption" style={styles.muted}>
        {label}
      </AppText>
      <AppText variant="h2" style={positive && styles.positive}>
        {value}
      </AppText>
    </View>
  );
};

interface CustomPaymentCardProps {
  amountText: string;
  onChangeAmount: (text: string) => void;
  currentStage: PaymentStage;
  outstanding: number;
  previewPayment: ReturnType<typeof usePaymentTimeline>['previewPayment'];
  virtualAccount?: string;
  isPaying: boolean;
  disabled: boolean;
  onPay: (amount: number) => void;
}

const CustomPaymentCard: React.FC<CustomPaymentCardProps> = ({
  amountText,
  onChangeAmount,
  currentStage,
  outstanding,
  previewPayment,
  virtualAccount,
  isPaying,
  disabled,
  onPay,
}) => {
  const { colors, iconSize } = useTheme();
  const styles = useThemedStyles(createStyles);

  const amount = toAmount(amountText);
  const error =
    amountText && amount <= 0
      ? 'Enter a valid amount'
      : amount > outstanding
      ? `Amount cannot exceed outstanding ${formatINR(outstanding)}`
      : null;
  const canPay = amount > 0 && !error;

  const preview = useMemo(() => previewPayment(Math.min(amount, outstanding)), [
    previewPayment,
    amount,
    outstanding,
  ]);

  const quickAmounts = [
    { label: `Stage ${currentStage.number} due`, value: currentStage.due },
    { label: 'Full balance', value: outstanding },
  ];

  const handleChange = (text: string) => {
    const [whole, decimals] = text
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1')
      .split('.');
    const int = whole.replace(/^0+(?=\d)/, '');
    onChangeAmount(decimals === undefined ? int : `${int}.${decimals.slice(0, 2)}`);
  };

  return (
    <View style={[styles.card, styles.payCard]}>
      <AppText variant="caption" style={styles.muted}>
        Enter any amount — it is applied to stages in order, starting with Stage{' '}
        {currentStage.number}.
      </AppText>

      <View style={[styles.inputBox, !!error && styles.inputBoxError]}>
        <AppText variant="h2" style={styles.inputPrefix}>
          ₹
        </AppText>
        <TextInput
          value={formatAmountInput(amountText)}
          onChangeText={handleChange}
          placeholder="0"
          placeholderTextColor={colors.textLight}
          keyboardType="decimal-pad"
          editable={!disabled}
          style={styles.input}
          accessibilityLabel="Payment amount"
        />
      </View>
      {error ? (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      ) : null}

      <View style={styles.quickRow}>
        {quickAmounts.map(quick => {
          const isSelected = amount === quick.value;

          return (
            <Pressable
              key={quick.label}
              disabled={disabled}
              onPress={() => onChangeAmount(String(quick.value))}
              style={[styles.quickChip, isSelected && styles.quickChipSelected]}
            >
              <AppText
                variant="caption"
                style={[styles.quickText, isSelected && styles.quickTextSelected]}
              >
                {quick.label} · {formatINR(quick.value)}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.breakdown}>
        <AppText variant="caption" style={styles.breakdownTitle}>
          Stage-wise breakdown
        </AppText>
        {preview.allocations.map(allocation => (
          <AllocationRow key={allocation.stage.key} allocation={allocation} />
        ))}
      </View>

      <View style={styles.totalsBox}>
        <View style={styles.spaceBetween}>
          <AppText variant="body" style={styles.muted}>
            You pay
          </AppText>
          <AppText variant="h2">{formatINR(canPay ? amount : 0)}</AppText>
        </View>
        <View style={[styles.spaceBetween, styles.totalsGap]}>
          <AppText variant="body" style={styles.muted}>
            Remaining balance
          </AppText>
          <AppText variant="subtitle" style={styles.remainingText}>
            {formatINR(canPay ? preview.remaining : outstanding)}
          </AppText>
        </View>
      </View>

      <Button
        title={canPay ? `Pay ${formatINR(amount)}` : 'Pay now'}
        size="lg"
        disabled={!canPay || disabled}
        loading={isPaying}
        loadingText="Opening secure checkout..."
        onPress={() => onPay(amount)}
        style={styles.payCardButton}
      />

      <View style={styles.vidRow}>
        <Icon name="lock-closed-outline" size={iconSize.xs} color={colors.textLight} />
        <AppText variant="caption" style={styles.muted}>
          Paid into your VID{' '}
          <AppText variant="caption" style={styles.vidText}>
            {virtualAccount ?? '-'}
          </AppText>
        </AppText>
      </View>
    </View>
  );
};

const AllocationRow: React.FC<{ allocation: StageAllocation }> = ({ allocation }) => {
  const { colors, iconSize } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { stage, applied, pendingAfter } = allocation;

  const isCleared = applied > 0 && pendingAfter === 0;
  const isPartial = applied > 0 && pendingAfter > 0;

  return (
    <View style={styles.allocRow}>
      <Icon
        name={isCleared ? 'checkmark-circle' : isPartial ? 'contrast' : 'ellipse-outline'}
        size={iconSize.sm}
        color={isCleared ? colors.success : isPartial ? colors.warning : colors.border}
      />
      <View style={styles.allocInfo}>
        <AppText variant="body" numberOfLines={1}>
          Stage {stage.number} · {stage.title}
        </AppText>
        <AppText variant="caption" style={styles.muted}>
          {applied > 0 ? `${formatINR(applied)} applied · ` : ''}
          {pendingAfter > 0 ? `${formatINR(pendingAfter)} pending` : 'Fully paid'}
        </AppText>
      </View>
    </View>
  );
};

interface StageRowProps {
  stage: PaymentStage;
  isLast: boolean;
  isPaying: boolean;
  disabled: boolean;
  onPay: () => void;
}

const StageRow: React.FC<StageRowProps> = ({ stage, isLast, isPaying, disabled, onPay }) => {
  const styles = useThemedStyles(createRowStyles(stage.status));
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
            {stage.note ? (
              <AppText variant="caption" style={styles.muted}>
                {stage.note}
              </AppText>
            ) : null}
            <AppText variant="caption" style={styles.amount}>
              {stage.amountLabel}
            </AppText>
          </View>

          <View style={styles.chip}>
            <AppText variant="caption" style={styles.chipText}>
              {stage.chipLabel}
            </AppText>
          </View>
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

const createStyles = ({ spacing, colors, radius, shadow, iconSize, typography }: AppTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Shared text colours
    muted: {
      color: colors.textLight,
    },
    positive: {
      color: colors.success,
    },
    inverse: {
      color: colors.textInverse,
    },

    // Layout
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xxl,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    sectionBar: {
      width: spacing.xs,
      height: spacing.md,
      marginRight: spacing.sm,
      borderRadius: radius.sm,
      backgroundColor: colors.accent,
    },
    sectionText: {
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: spacing.xs / 4,
    },
    spaceBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    // Summary card
    summaryShadow: {
      borderRadius: radius.xl,
      backgroundColor: colors.primary,
      ...shadow.lg,
    },
    summaryCard: {
      padding: spacing.lg,
      borderRadius: radius.xl,
      overflow: 'hidden',
    },
    summaryCircle: {
      position: 'absolute',
      top: -spacing.xl,
      right: -spacing.lg,
      width: iconSize.xl * 4,
      height: iconSize.xl * 4,
      borderRadius: radius.full,
      backgroundColor: colors.chipBg,
    },
    summaryLabel: {
      textTransform: 'uppercase',
      letterSpacing: spacing.xs / 4,
    },
    summaryFooter: {
      marginTop: spacing.md,
    },
    nextDueChip: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      backgroundColor: colors.chipBg,
    },
    nextDueText: {
      color: colors.accent,
      fontWeight: typography.fontWeight.medium,
    },

    // Cards (stat tiles + stages)
    card: {
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      ...shadow.sm,
    },
    tilesRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    tile: {
      flex: 1,
      padding: spacing.md,
    },
    stagesCard: {
      overflow: 'hidden',
    },

    // Make a payment card
    payCard: {
      padding: spacing.lg,
    },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    inputBoxError: {
      borderColor: colors.warning,
    },
    inputPrefix: {
      marginRight: spacing.xs,
      color: colors.textLight,
    },
    input: {
      flex: 1,
      paddingVertical: spacing.sm,
      fontSize: iconSize.md,
      fontWeight: typography.fontWeight.medium,
      color: colors.text,
    },
    errorText: {
      marginTop: spacing.xs,
      color: colors.warning,
    },
    quickRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    quickChip: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    quickChipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.infoLight,
    },
    quickText: {
      color: colors.textLight,
      fontWeight: typography.fontWeight.medium,
    },
    quickTextSelected: {
      color: colors.primary,
    },
    breakdown: {
      marginTop: spacing.lg,
      gap: spacing.sm,
    },
    breakdownTitle: {
      color: colors.textLight,
      textTransform: 'uppercase',
      letterSpacing: spacing.xs / 4,
    },
    allocRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    allocInfo: {
      flex: 1,
    },
    totalsBox: {
      marginTop: spacing.lg,
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.background,
    },
    totalsGap: {
      marginTop: spacing.xs,
    },
    remainingText: {
      color: colors.warning,
    },
    payCardButton: {
      alignSelf: 'stretch',
      marginTop: spacing.md,
    },
    vidRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    vidText: {
      color: colors.text,
      fontWeight: typography.fontWeight.medium,
    },

    footerNote: {
      marginTop: spacing.lg,
      textAlign: 'center',
    },
  });

const createProgressStyles =
  (percent: number) =>
  ({ spacing, colors, radius }: AppTheme) =>
    StyleSheet.create({
      track: {
        height: spacing.xs,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
        borderRadius: radius.full,
        backgroundColor: colors.chipBg,
        overflow: 'hidden',
      },
      fill: {
        width: `${Math.min(Math.max(percent, 0), 100)}%`,
        height: '100%',
        borderRadius: radius.full,
        backgroundColor: colors.accent,
      },
    });

const createRowStyles =
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
      muted: {
        color: colors.textLight,
      },
      stageLabel: {
        color: colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: spacing.xs / 4,
      },
      amount: {
        marginTop: spacing.xs / 2,
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