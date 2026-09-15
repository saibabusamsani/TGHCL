import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText, Button } from '../../../components';
import { BillFormState, Milestone, toBillPayload } from '../../../types';
import { useSubmitBillMutation } from '../../../api/rtk';
import { AttachmentTile, DropdownOption, FormDateField, FormDropdown, FormField, MilestoneSummaryCard } from '../components';
import { formatDateShort } from '../../../utils';

const PROJECT_OPTIONS: DropdownOption[] = [
  { label: 'TGHCL-PRJ-000124 — Ramulu Kondal', value: 'TGHCL-PRJ-000124' },
];

const MILESTONES: Record<string, Milestone[]> = {
  'TGHCL-PRJ-000124': [
    {
      id: 'm4',
      label: 'Milestone 4 — Brick Masonry — 10% (₹60,000)',
      categoryLabel: 'Civil Works',
      contractValue: 600000,
      payablePercent: 10,
      amountToRelease: 60000,
      dueDate: new Date(2026, 11, 31).toISOString(),
    },
  ],
};

interface FormErrors {
  projectId?: string;
  milestoneId?: string;
  billNumber?: string;
  billAmount?: string;
}

const BillForm = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const navigation = useNavigation();
  const [submitBill, { isLoading }] = useSubmitBillMutation();

  const [form, setForm] = useState<BillFormState>({
    projectId: null,
    milestoneId: null,
    billDate: new Date(2026, 8, 17),
    billNumber: '',
    billAmount: '',
    remarks: '',
    photos: [],
    video: null,
    document: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = <K extends keyof BillFormState>(key: K, value: BillFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const milestoneOptions: DropdownOption[] = useMemo(
    () => (form.projectId ? MILESTONES[form.projectId] ?? [] : []).map((m) => ({ label: m.label, value: m.id })),
    [form.projectId],
  );

  const selectedMilestone: Milestone | undefined = useMemo(
    () => (form.projectId ? MILESTONES[form.projectId]?.find((m) => m.id === form.milestoneId) : undefined),
    [form.projectId, form.milestoneId],
  );

  const handleProjectChange = (projectId: string) => {
    setForm((prev) => ({ ...prev, projectId, milestoneId: null, billAmount: '' }));
    setErrors((prev) => ({ ...prev, projectId: undefined }));
  };

  const handleMilestoneChange = (milestoneId: string) => {
    const milestone = form.projectId ? MILESTONES[form.projectId]?.find((m) => m.id === milestoneId) : undefined;
    setForm((prev) => ({
      ...prev,
      milestoneId,
      billAmount: milestone ? String(milestone.amountToRelease) : prev.billAmount,
    }));
    setErrors((prev) => ({ ...prev, milestoneId: undefined }));
  };

  const isOnTime = selectedMilestone ? form.billDate <= new Date(selectedMilestone.dueDate) : false;

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.projectId) newErrors.projectId = '* Please select a project';
    if (!form.milestoneId) newErrors.milestoneId = '* Please select a milestone';
    if (!form.billNumber.trim()) newErrors.billNumber = '* Bill number is required';
    if (!form.billAmount || Number(form.billAmount) <= 0) newErrors.billAmount = '* Enter a valid amount';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (form.photos.length === 0) {
      Toast.show({ type: 'error', text1: '* Please attach at least one site photo' });
      return;
    }
    if (!form.video) {
      Toast.show({ type: 'error', text1: '* Please attach a walkthrough video' });
      return;
    }
    if (!form.document) {
      Toast.show({ type: 'error', text1: '* Please attach a supporting document' });
      return;
    }

    await submitBill(toBillPayload(form)).unwrap();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={styles.hitSlop} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={iconSize.md} color={colors.secondary} />
        </TouchableOpacity>
        <View>
          <AppText variant="h2">Submit Bill</AppText>
          <AppText variant="body" style={styles.headerSubtitle}>Govt. of Telangana</AppText>
        </View>
      </View>
      <View style={styles.headerAccent} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <FormDropdown
            label="Project"
            placeholder="Select project"
            value={form.projectId}
            options={PROJECT_OPTIONS}
            onChange={handleProjectChange}
            error={errors.projectId}
          />

          <FormDropdown
            label="Milestone"
            placeholder="Select milestone"
            value={form.milestoneId}
            options={milestoneOptions}
            onChange={handleMilestoneChange}
            disabled={!form.projectId}
            visible={!!form.projectId}
            error={errors.milestoneId}
          />

          <FormDateField label="Bill Date" value={form.billDate} onChange={(date) => updateField('billDate', date)} />

          {selectedMilestone ? (
            <MilestoneSummaryCard
              categoryLabel={selectedMilestone.categoryLabel}
              contractValue={selectedMilestone.contractValue}
              payablePercent={selectedMilestone.payablePercent}
              amountToRelease={selectedMilestone.amountToRelease}
              onTime={isOnTime}
              dueDateLabel={formatDateShort(selectedMilestone.dueDate)}
            />
          ) : null}

          <FormField
            label="Bill Number"
            placeholder="e.g. BILL-2026-0001"
            value={form.billNumber}
            onChangeText={(text) => updateField('billNumber', text)}
            error={errors.billNumber}
          />

          <FormField
            label="Bill Amount (₹)"
            hint="Auto-filled from milestone %, editable"
            placeholder="0.00"
            value={form.billAmount}
            onChangeText={(text) => updateField('billAmount', text)}
            keyboardType="numeric"
            rightIcon={<AppText variant="body" style={styles.currencyIcon}>₹</AppText>}
            error={errors.billAmount}
          />

          <FormField
            label="Remarks"
            placeholder="Work summary and remarks"
            value={form.remarks}
            onChangeText={(text) => updateField('remarks', text)}
            multiline
            minLines={3}
          />

          <AppText variant="caption" style={styles.sectionLabel}>EVIDENCE — PHOTOS & VIDEOS *</AppText>
          <View style={styles.tileRow}>
            <AttachmentTile label="Attach Photos" iconName="camera-outline" count={form.photos.length} onPress={() => {}} />
            <AttachmentTile label="Attach Video" iconName="videocam-outline" count={form.video ? 1 : 0} onPress={() => {}} />
          </View>
          <AppText variant="caption" style={styles.helperText}>
            Geotagged site photos and a short walkthrough video are required before the bill can be submitted.
          </AppText>

          <AppText variant="caption" style={styles.sectionLabel}>SUPPORTING DOCUMENTS</AppText>
          <AttachmentTile label="Attach Document" iconName="attach-outline" count={form.document ? 1 : 0} onPress={() => {}} fullWidth />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Button
            title="Submit Bill for AE Verification"
            onPress={handleSubmit}
            size="lg"
            gradient="primary"
            style={styles.submitButton}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default BillForm;

const createStyles = ({ spacing, colors, radius, iconSize, isLandscape, isTablet }: AppTheme) => {
  const constrained = isLandscape || isTablet;

  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
      gap: spacing.md,
    },
    headerSubtitle: { color: colors.textLight },
    headerAccent: { height: spacing.xs / 2, backgroundColor: colors.accent },
    headerSpacer: { width: iconSize.md },
    hitSlop: { top: spacing.sm, bottom: spacing.sm, left: spacing.sm, right: spacing.sm },
    scrollContent: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
      alignItems: constrained ? 'center' : undefined,
    },
    content: { width: '100%', maxWidth: constrained ? 500 : undefined },
    currencyIcon: { color: colors.accent, fontWeight: '700' },
    sectionLabel: { color: colors.primaryDark, letterSpacing: 0.8, fontWeight: '700', marginBottom: spacing.sm },
    tileRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
    helperText: { color: colors.textLight, marginBottom: spacing.lg },
    footer: {
      padding: spacing.md,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: constrained ? 'center' : undefined,
    },
    footerContent: { width: '100%', maxWidth: constrained ? 700 : undefined },
    submitButton: { width: '100%', borderRadius: radius.md },
  });
};