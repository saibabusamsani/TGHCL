
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AppTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components';

interface TabButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ title, active, onPress }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.tab, active && styles.tabActive]}
    >
      <AppText
        variant="caption"
        color={active ? styles.activeTextColor.color : styles.inactiveTextColor.color}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
};

const createStyles = ({ spacing, radius, colors }: AppTheme) => ({
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeTextColor: {
    color: colors.white,
  },
  inactiveTextColor: {
    color: colors.textLight,
  },
});