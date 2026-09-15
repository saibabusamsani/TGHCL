import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { AppText } from '../../../components';
import { GradientBackground } from '../../../components';
import { Header } from '../components/Header';
import { PortfolioCard } from '../components/PortfolioCard';
import { LedgerCard } from '../components/LedgerCard';
import { WorkItemCard } from '../components/WorkItemCard';
import { StatusPill } from '../components/StatusPill';
import Icon from '@react-native-vector-icons/ionicons';

export const DashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Header
        companyName="Sri Balaji Constructions"
        classLabel="CLASS-1A"
        contractorId="TS-HYD-2018-C8841"
        verified
        syncedAt="12 Oct 2024, 09:41 AM IST"
        ledgerLocked
      />

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionBar} />
          <AppText variant="caption" color={colors.text} style={styles.sectionHeader}>
            CONTRACT EXECUTION PORTFOLIO
          </AppText>
          <View style={styles.sectionSpacer} />
          <StatusPill label="Q3 FY 2024-25" tone="neutral" />
        </View>

        <View style={styles.gridRow}>
          <PortfolioCard
            label="Assigned Works"
            value="06"
            sublabel="100% Scope"
            dotColor={colors.primary}
          />
          <PortfolioCard
            label="Active / On Track"
            value="05"
            sublabel="83.3% Rate"
            dotColor={colors.primary}
            progress={0.833}
            progressColor={colors.primary}
          />
        </View>
        <View style={styles.gridRow}>
          <PortfolioCard
            label="Completed"
            value="01"
            sublabel="Handover Done"
            dotColor={colors.success}
            progress={1}
            progressColor={colors.success}
          />
          <PortfolioCard
            label="Critical Slippage"
            value="00"
            sublabel="Nil Slippage"
            dotColor={colors.secondary}
          />
        </View>

        <LedgerCard
          sanctionedValue="₹36,00,000.00"
          worksBound="6 Works Bound"
          committedValue="₹3,12,000"
          committedPct={8.67}
          disbursedPct={1.7}
          escrowPct={7.0}
          unbilledPct={91.3}
          disbursedAmount="₹60,000"
          pendingAmount="₹2,52,000"
          disbursedBillCount={1}
          pendingBillCount={3}
        />

        <View style={styles.linkRow}>
          <AppText variant="caption" color={colors.primary} style={styles.linkText}>
            📄 Download Form 16-A
          </AppText>
          <AppText variant="caption" color={colors.primary} style={styles.linkText}>
            📄 View MB Ledger
          </AppText>
        </View>

        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionBar} />
          <AppText variant="caption" color={colors.text} style={styles.sectionHeader}>
            ACTIVE CONTRACT WORKS
          </AppText>
          <StatusPill label="3 of 6" tone="neutral" />
          <View style={styles.sectionSpacer} />
          <AppText variant="caption" color={colors.primary} style={styles.viewAll}>
            View All (6) ›
          </AppText>
        </View>

        <WorkItemCard
          code="TGHCL-PRJ-000124"
          status="EXECUTION"
          statusTone="info"
          icon="home-outline"
          iconTone="info"
          title="Milestone 4 — Brick Masonry & Plaster"
          subtitle="Hyd North Circle · Ward 12 (Kukatpally Zone)"
          progressLabel="Milestone Physical Progress"
          progressValue="68% Complete"
          progress={0.68}
          progressColor={colors.primary}
          footerLeft="📍 Geo-Tagged Q/C Validated"
          footerRight="18 Days left"
          footerRightTone="neutral"
        />

        <WorkItemCard
          code="TGHCL-PRJ-000098"
          status="CERTIFIED"
          statusTone="success"
          icon="book-outline"
          iconTone="success"
          title="Sub-base Asphalt Paving - Access Roads"
          subtitle="Secunderabad Division · Package 4B"
          progressLabel="Final Stage Clearance"
          progressValue="100% Inspected"
          progress={1}
          progressColor={colors.success}
          footerLeft="MB Record: MB-2024-PG-88"
          footerRight="Bill #1 Disbursed"
          footerRightTone="success"
        />

        <WorkItemCard
          code="TGHCL-PRJ-000142"
          status="SCRUTINY"
          statusTone="warning"
          icon="briefcase-outline"
          iconTone="warning"
          title="Stormwater Drainage Culvert & RCC Sump"
          subtitle="Cyberabad Circle · Package 2"
          footerLeft="Structural Drawing Re-audit"
          footerRight="EE Approval Pending"
          footerRightTone="warning"
        />

        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionBar} />
          <AppText variant="caption" color={colors.text} style={styles.sectionHeader}>
            STATUTORY SUBMISSIONS
          </AppText>
          <View style={styles.sectionSpacer} />
          <StatusPill label="Form 16-A Active" tone="neutral" />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.85} onPress={() => {}}>
            <GradientBackground gradient="primary" style={styles.actionCard}>
              <View style={styles.actionTextColumn}>
                <AppText variant="body" color={colors.white} style={styles.actionTitle} numberOfLines={1}>
                  Submit e-MB
                </AppText>
                <AppText variant="caption" color={colors.white} style={styles.actionSubtitle} numberOfLines={1}>
                  Record Field Book
                </AppText>
              </View>
              <View style={styles.actionIconCircle}>
                <Icon name="add" size={18} color={colors.white} />
              </View>
            </GradientBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.85} onPress={() => {}}>
            <View style={[styles.actionCard, styles.actionCardSurface]}>
              <View style={styles.actionTextColumn}>
                <AppText variant="body" color={colors.text} style={styles.actionTitle} numberOfLines={1}>
                  Raise RA Bill
                </AppText>
                <AppText variant="caption" color={colors.textLight} style={styles.actionSubtitle} numberOfLines={1}>
                  Milestone 4 Billing
                </AppText>
              </View>
              <View style={[styles.actionIconCircle, styles.actionIconCircleSurface]}>
                <Icon name="document-text-outline" size={18} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = ({ spacing, colors, radius }: AppTheme) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: spacing.xl,
      backgroundColor: colors.background,
    },
    body: {
      paddingHorizontal: spacing.md,
      maxWidth: 600,
      width: '100%',
      alignSelf: 'center',
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      gap: spacing.xs,
    },
    sectionBar: {
      width: spacing.xs / 2,
      height: spacing.md,
      borderRadius: radius.sm,
      backgroundColor: colors.primary,
    },
    sectionHeader: {
      fontWeight: '800',
      letterSpacing: 0.6,
    },
    sectionSpacer: {
      flex: 1,
    },
    viewAll: {
      fontWeight: '700',
    },
    gridRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    linkRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      paddingHorizontal: spacing.xs,
    },
    linkText: {
      fontWeight: '600',
    },
    actionRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.md,
      alignSelf: 'center',
      width: '100%',
      maxWidth: spacing.xxl * spacing.lg,
    },
    actionButton: {
      flex: 1,
      maxWidth: spacing.xxl * spacing.xl * 0.4,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: radius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    actionCardSurface: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionTextColumn: {
      flexShrink: 1,
    },
    actionTitle: {
      fontWeight: '700',
    },
    actionSubtitle: {
      marginTop: spacing.xs / 2,
      opacity: 0.85,
    },
    actionIconCircle: {
      width: spacing.xl,
      height: spacing.xl,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacing.sm,
    },
    actionIconCircleSurface: {
      backgroundColor: colors.background,
    },
  });