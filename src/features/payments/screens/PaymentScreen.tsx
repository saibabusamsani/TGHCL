import React, { ComponentRef, useRef } from 'react';
import { Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Icon from '@react-native-vector-icons/ionicons';

import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { FormInput, FormInputHandle } from '../../auth/components/FormInput';
import { usePaymentTimeline } from '../hooks/usePaymentTimeline';
import { SummaryCard } from '../components/SummaryCard';
import { StageRow } from '../components/StageRow';
import { formatAmountInput, formatINR } from '../../../utils';
import { Shimmer, SkeletonProvider } from '../../../components/Skeleton';

const ALLOC = {
  cleared: { icon: 'checkmark-circle', color: 'success' },
  partial: { icon: 'contrast', color: 'warning' },
  none: { icon: 'ellipse-outline', color: 'border' },
} as const;

export const PaymentScreen: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize, spacing } = useTheme();

  const scrollRef = useRef<ComponentRef<typeof KeyboardAwareScrollView>>(null);
  const emailInputRef = useRef<FormInputHandle>(null);
  const viewportHeight = useRef(0);
  const emailSection = useRef({ y: 0, height: 0 });

  const {
    user,
    summary,
    loading,
    isFetching,
    refetch,
    stages,
    currentStage,
    total,
    totalPaid,
    outstanding,
    previewPayment,
    email,
    setEmail,
    emailError,
    amountText,
    setAmountText,
    amount,
    payable,
    isProcessing,
    payingFrom,
    pay,
  } = usePaymentTimeline({
    onInvalidEmail: () => {
      const { y, height } = emailSection.current;
      scrollRef.current?.scrollTo({
        y: Math.max(y + height / 2 - viewportHeight.current / 2, 0),
        animated: true,
      });
      setTimeout(() => emailInputRef.current?.focus(), 350);
    },
  });

  return (
    <SkeletonProvider loading={loading}>
      <View style={styles.safe}>
        <KeyboardAwareScrollView
          ref={scrollRef}
          onLayout={e => (viewportHeight.current = e.nativeEvent.layout.height)}
          bottomOffset={spacing.lg}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !loading}
              onRefresh={() => {
                if (!loading) refetch();
              }}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <AppText variant="h1">Payments</AppText>
          <View style={styles.subtitle}>
            <Shimmer width="70%" height={16}>
              <AppText variant="subtitle" style={styles.muted}>
                {summary?.projectName} · VID {summary?.virtualAccount}
              </AppText>
            </Shimmer>
          </View>

          <SectionTitle title="Payment summary" />
          <SummaryCard
            total={total}
            totalPaid={totalPaid}
            outstanding={outstanding}
            stages={stages}
            currentStage={currentStage}
          />

          <View style={styles.tilesRow}>
            <View style={[styles.card, styles.tile]}>
              <AppText variant="caption" style={styles.muted}>
                Total cost
              </AppText>
              <View style={styles.tileValue}>
                <Shimmer width="80%" height={22}>
                  <AppText variant="h2">{formatINR(total)}</AppText>
                </Shimmer>
              </View>
            </View>
            <View style={[styles.card, styles.tile]}>
              <AppText variant="caption" style={styles.muted}>
                Paid
              </AppText>
              <View style={styles.tileValue}>
                <Shimmer width="80%" height={22}>
                  <AppText variant="h2" style={styles.positive}>
                    {formatINR(totalPaid)}
                  </AppText>
                </Shimmer>
              </View>
            </View>
          </View>

          {!user?.email && currentStage && (
            <View onLayout={e => (emailSection.current = e.nativeEvent.layout)}>
              <SectionTitle title="Receipt email" />
              <View style={[styles.card, styles.payCard]}>
                <AppText variant="caption" style={styles.muted}>
                  Add your email to receive the payment receipt.
                </AppText>
                <FormInput
                  ref={emailInputRef}
                  label="Email address"
                  iconName="mail"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  editable={!isProcessing}
                  error={emailError}
                />
              </View>
            </View>
          )}

          <SectionTitle title="Payment stages" />
          <View style={[styles.card, styles.stagesCard]}>
            {stages.map((stage, index) => (
              <StageRow
                key={stage.key}
                stage={stage}
                isLast={index === stages.length - 1}
                isPaying={isProcessing && payingFrom === 'stage'}
                disabled={isProcessing}
                onPay={() => pay(stage.due, 'stage')}
              />
            ))}
          </View>

          {currentStage && (
            <>
              <SectionTitle title="Make a payment" />
              <View style={[styles.card, styles.payCard]}>
                <AppText variant="caption" style={styles.muted}>
                  Enter any amount — it is applied to stages in order, starting with Stage{' '}
                  {currentStage.number}.
                </AppText>

                <View style={[styles.inputBox, amount > outstanding && styles.inputBoxError]}>
                  <AppText variant="h2" style={styles.inputPrefix}>
                    ₹
                  </AppText>
                  <TextInput
                    value={amountText}
                    onChangeText={text => setAmountText(formatAmountInput(text))}
                    placeholder="0"
                    placeholderTextColor={colors.textLight}
                    keyboardType="decimal-pad"
                    editable={!isProcessing}
                    style={styles.input}
                    accessibilityLabel="Payment amount"
                  />
                </View>
                {amount > outstanding && (
                  <AppText variant="caption" style={styles.errorText}>
                    Amount cannot exceed outstanding {formatINR(outstanding)}
                  </AppText>
                )}

                <View style={styles.quickRow}>
                  {[
                    { label: `Stage ${currentStage.number} due`, value: currentStage.due },
                    ...(outstanding > currentStage.due
                      ? [{ label: 'Full balance', value: outstanding }]
                      : []),
                  ].map(({ label, value }) => (
                    <Pressable
                      key={label}
                      disabled={isProcessing}
                      onPress={() => setAmountText(String(value))}
                      style={[styles.quickChip, amount === value && styles.quickChipSelected]}
                    >
                      <AppText
                        variant="caption"
                        style={[styles.quickText, amount === value && styles.quickTextSelected]}
                      >
                        {label} · {formatINR(value)}
                      </AppText>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.breakdown}>
                  <AppText variant="caption" style={styles.breakdownTitle}>
                    Stage-wise breakdown
                  </AppText>
                  {previewPayment(payable).map(({ stage, applied, pendingAfter, state }) => (
                    <View key={stage.key} style={styles.allocRow}>
                      <Icon
                        name={ALLOC[state].icon}
                        size={iconSize.sm}
                        color={colors[ALLOC[state].color]}
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
                  ))}
                </View>

                <View style={styles.totalsBox}>
                  <View style={styles.spaceBetween}>
                    <AppText variant="body" style={styles.muted}>
                      You pay
                    </AppText>
                    <AppText variant="h2">{formatINR(payable)}</AppText>
                  </View>
                  <View style={[styles.spaceBetween, styles.totalsGap]}>
                    <AppText variant="body" style={styles.muted}>
                      Remaining balance
                    </AppText>
                    <AppText variant="subtitle" style={styles.remainingText}>
                      {formatINR(outstanding - payable)}
                    </AppText>
                  </View>
                </View>

                <Button
                  title={payable ? `Pay ${formatINR(payable)}` : 'Pay now'}
                  size="lg"
                  disabled={!payable || isProcessing}
                  loading={isProcessing && payingFrom === 'custom'}
                  loadingText="Opening secure checkout..."
                  onPress={() => pay(payable, 'custom')}
                  style={styles.payCardButton}
                />

                <View style={styles.vidRow}>
                  <Icon name="lock-closed-outline" size={iconSize.xs} color={colors.textLight} />
                  <AppText variant="caption" style={styles.muted}>
                    Paid into your VID{' '}
                    <AppText variant="caption" style={styles.vidText}>
                      {summary?.virtualAccount}
                    </AppText>
                  </AppText>
                </View>
              </View>
            </>
          )}

          {!loading && !currentStage && (
            <>
              <SectionTitle title="Payment status" />
              <View style={[styles.card, styles.payCard]}>
                <AppText variant="subtitle" style={styles.positive}>
                  All instalments are fully paid. Thank you!
                </AppText>
              </View>
            </>
          )}

          <AppText variant="caption" style={[styles.muted, styles.footerNote]}>
            Payments are processed securely through PayU. A receipt is issued after every
            successful payment.
          </AppText>
        </KeyboardAwareScrollView>
      </View>
    </SkeletonProvider>
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

const createStyles = ({ spacing, colors, radius, shadow, iconSize, typography }: AppTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xxl,
    },
    subtitle: {
      marginTop: spacing.xs,
    },
    muted: {
      color: colors.textLight,
    },
    positive: {
      color: colors.success,
    },
    spaceBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    tileValue: {
      marginTop: spacing.xs,
    },
    stagesCard: {
      overflow: 'hidden',
    },
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