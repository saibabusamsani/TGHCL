import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components';

interface AttachmentTileProps {
  label: string;
  iconName: string;
  count?: number;
  onPress: () => void;
  fullWidth?: boolean;
}

export const AttachmentTile: React.FC<AttachmentTileProps> = ({ label, iconName, count, onPress, fullWidth = false }) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();

  return (
    <TouchableOpacity style={[styles.tile, fullWidth && styles.tileFullWidth]} activeOpacity={0.85} onPress={onPress}>
      <Ionicons name={iconName as any} size={iconSize.md} color={colors.tileIcon} />
      <AppText variant="body" style={styles.label}>{label}</AppText>
      {count ? (
        <View style={styles.countBadge}>
          <AppText variant="caption" style={styles.countText}>{count}</AppText>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const createStyles = ({ spacing, colors, radius, shadow, iconSize }: AppTheme) =>
  StyleSheet.create({
    tile: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.tileBackground,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.tileIcon,
      paddingVertical: spacing.md,
      gap: spacing.xs,
    },
    tileFullWidth: { flex: undefined, width: '100%' },
    label: { color: colors.tileIcon, fontWeight: '700' },
    countBadge: {
      backgroundColor: colors.tileIcon,
      borderRadius: radius.full,
      minWidth: iconSize.sm,
      height: iconSize.sm,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    countText: { color: colors.white, fontWeight: '700' },
  });