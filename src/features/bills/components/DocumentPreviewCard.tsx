import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components';
import { PickedDocument } from '../../../types/media.type';
import { formatFileSize, openDocumentExternally } from '../../../utils';

interface DocumentPreviewCardProps {
  document: PickedDocument;
  onRemove: () => void;
}

const STATUS_LABEL: Record<PickedDocument['verificationStatus'], string> = {
  pending: 'Verifying signature…',
  verified: 'Digital Signature Verified',
  failed: 'Signature verification failed',
};

export const DocumentPreviewCard: React.FC<DocumentPreviewCardProps> = ({ document, onRemove }) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();

  const statusColor =
    document.verificationStatus === 'verified'
      ? colors.success
      : document.verificationStatus === 'failed'
      ? colors.error
      : colors.textLight;

  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <AppText variant="caption" style={styles.iconText}>PDF</AppText>
      </View>

      <View style={styles.info}>
        <AppText variant="body" style={styles.fileName} numberOfLines={1}>
          {document.name}
        </AppText>
        <View style={styles.metaRow}>
          <AppText variant="caption" style={styles.metaText}>{formatFileSize(document.sizeBytes)}</AppText>
          <AppText variant="caption" style={styles.metaText}>•</AppText>
          <AppText variant="caption" style={[styles.metaText, { color: statusColor }]}>
            {STATUS_LABEL[document.verificationStatus]}
          </AppText>
        </View>
      </View>

      <TouchableOpacity hitSlop={8} onPress={() => openDocumentExternally(document.uri)} style={styles.actionButton}>
        <Ionicons name="open-outline" size={iconSize.sm} color={colors.textLight} />
      </TouchableOpacity>
      <TouchableOpacity hitSlop={8} onPress={onRemove} style={styles.actionButton}>
        <Ionicons name="trash-outline" size={iconSize.sm} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, shadow }: AppTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 0.5,
      borderColor: colors.border,
      padding: spacing.md,
      marginTop: spacing.sm,
      ...shadow.sm,
    },
    iconBadge: {
      width: spacing.xxl,
      height: spacing.xxl,
      borderRadius: radius.sm,
      backgroundColor: colors.errorLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    iconText: { color: colors.error, fontWeight: '700' },
    info: { flex: 1 },
    fileName: { color: colors.text, fontWeight: '600' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs / 2 },
    metaText: { color: colors.textLight },
    actionButton: { marginLeft: spacing.sm },
  });