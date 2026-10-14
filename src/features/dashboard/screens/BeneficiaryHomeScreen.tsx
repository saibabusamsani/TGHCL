import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useGetBeneficiaryDetailsQuery } from '../../projects/projects.api';
import { useAppSelector } from '../../../store/hooks';
import ErrorState from '../../../components/ErrorState';
import { AppText } from '../../../components/AppText';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { getErrorType } from '../../../api/errorHandler';
import NoDetails from '../components/beneficiary/NoDetails';
import { formatDateShortAndTime } from '../../../utils';
import { Shimmer, SkeletonProvider } from '../../../components/Skeleton';

const BeneficiaryHomeScreen = () => {
  const { colors, iconSize } = useTheme();
  const styles = useThemedStyles(createStyles);

  const mobileNumber = useAppSelector(state => state.authentication.user?.mobileNumber);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetBeneficiaryDetailsQuery();

  const beneficiary = data?.[0];


  if (isError) {
    return <ErrorState type={getErrorType(error)} onRetry={refetch} retryLoading={isFetching} />;
  }

  if (!isLoading && !beneficiary) {
    return (
      <NoDetails
        message={`We couldn't find a beneficiary linked to the mobile number +91${mobileNumber}.`}
        onRetry={refetch}
        loading={isFetching}
      />
    );
  }

  return (
    <SkeletonProvider loading={isLoading}>
      <View style={styles.screen}>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          accessibilityState={{ busy: isLoading }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={() => {
                refetch();
              }}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* My House */}
          <SectionTitle icon="home-outline" title="My House" />
          <View style={styles.card}>
            <View style={styles.houseBand}>
              <Shimmer width="70%" height={24} onPrimary>
                <AppText variant="h2" color={colors.textInverse}>
                  {beneficiary?.project}
                </AppText>
              </Shimmer>
              <View style={styles.inline}>
                <Icon name="location-outline" size={iconSize.xs} color={colors.textInverse} />
                <Shimmer width="50%" height={12} onPrimary>
                  <AppText variant="caption" color={colors.textInverse} style={styles.flex}>
                    {beneficiary?.site}
                  </AppText>
                </Shimmer>
              </View>
              <View style={styles.approvedBadge}>
                <Icon name="shield-checkmark" size={iconSize.xs} color={colors.textInverse} />
                <AppText variant="caption" color={colors.textInverse} style={styles.bold}>
                  VC & HC Approved
                </AppText>
                <Shimmer width={70} height={12} onPrimary>
                  <AppText variant="caption" color={colors.textInverse} style={styles.bold}>
                    - {formatDateShortAndTime(beneficiary?.vcHcApprovedAt ?? "")}
                  </AppText>
                </Shimmer>
              </View>
            </View>

            <View style={styles.grid}>
              {/* <Tile label="Allotment No" value={beneficiary?.allotmentNo} />
              <Tile label="Type" value={beneficiary?.allotmentType} /> */}
              <Tile label="Constituency" value={beneficiary?.ac} />
              <Tile label="Division" value={beneficiary?.division} />
            </View>
          </View>

          {/* My Details */}
          <SectionTitle icon="person-outline" title="My Details" />
          <View style={styles.card}>
            <DetailRow icon="document-text-outline" label="Application No" value={beneficiary?.applicationNo} />
            <DetailRow icon="pricetag-outline" label="Category">
              <Shimmer width={80} height={20}>
                <View style={styles.chip}>
                  <AppText variant="caption" color={colors.primary} style={styles.bold}>
                    {beneficiary?.category}
                  </AppText>
                </View>
              </Shimmer>
            </DetailRow>
            <DetailRow icon="card-outline" label="VID (Virtual ID)" value={beneficiary?.virtualAccount} />
            <DetailRow icon="call-outline" label="Mobile" value={beneficiary?.mobile} />
            <DetailRow icon="finger-print-outline" label="Aadhaar" isLast>
              <Shimmer width="45%">
                <View style={styles.inline}>
                  <AppText variant="body" color={colors.text} style={styles.bold}>
                    {beneficiary?.aadhaarMasked ?? '-'}
                  </AppText>
                  <Icon name="lock-closed" size={iconSize.xs} color={colors.textLight} />
                </View>
              </Shimmer>
              <AppText variant="caption" color={colors.textLight}>
                Masked for your security
              </AppText>
            </DetailRow>
          </View>
        </ScrollView>
      </View>
    </SkeletonProvider>
  );
};


const SectionTitle = ({ icon, title }: { icon: string; title: string }) => {
  const { colors, iconSize } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.sectionTitle} accessibilityRole="header">
      <Icon name={icon as any} size={iconSize.sm} color={colors.primary} />
      <AppText variant="body" color={colors.text} style={styles.bold}>
        {title}
      </AppText>
    </View>
  );
};

const Tile = ({ label, value }: { label: string; value?: string | number }) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.tileWrap}>
      <View style={styles.tile} accessible accessibilityLabel={`${label}: ${value ?? 'loading'}`}>
        <AppText variant="caption" color={colors.textLight}>
          {label}
        </AppText>
        <Shimmer width="70%">
          <AppText variant="body" color={colors.text} style={styles.bold} numberOfLines={2}>
            {value ?? '-'}
          </AppText>
        </Shimmer>
      </View>
    </View>
  );
};

type DetailRowProps = {
  icon: string;
  label: string;
  value?: string | number;
  isLast?: boolean;
  children?: React.ReactNode;
};

const DetailRow = ({ icon, label, value, isLast, children }: DetailRowProps) => {
  const { colors, iconSize } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.rowIcon}>
        <Icon name={icon as any} size={iconSize.sm} color={colors.primary} />
      </View>
      <View style={styles.rowBody}>
        <AppText variant="caption" color={colors.textLight}>
          {label}
        </AppText>
        {children ?? (
          <Shimmer width="55%">
            <AppText variant="body" color={colors.text} style={styles.bold}>
              {value ?? '-'}
            </AppText>
          </Shimmer>
        )}
      </View>
    </View>
  );
};


const createStyles = ({ spacing, colors, radius, shadow }: AppTheme) =>
  StyleSheet.create({
    flex: { flex: 1 },
    bold: { fontWeight: '700' },
    inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, paddingBottom: spacing.xxl },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      marginTop: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.successLight,
    },
    statusDot: {
      width: spacing.xs,
      height: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.success,
    },

    /* Sections & cards */
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden',
      ...shadow.sm,
    },

    /* My House */
    houseBand: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      gap: spacing.xs,
    },
    approvedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      marginTop: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.chipBg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: spacing.sm,
    },
    tileWrap: { width: '50%', padding: spacing.xs },
    tile: {
      minHeight: 64,
      padding: spacing.sm,
      gap: spacing.xs,
      borderRadius: radius.sm,
      backgroundColor: colors.ledgerBg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },

    /* My Details */
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: 64,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.sm,
      backgroundColor: colors.infoLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowBody: { flex: 1, gap: 2 },
    chip: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
      backgroundColor: colors.infoLight,
    },
  });

export default BeneficiaryHomeScreen;