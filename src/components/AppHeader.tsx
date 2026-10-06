import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppTheme, useTheme, useThemedStyles } from '../theme';
import { AppText } from './AppText';


export type HeaderAction = 'notifications' | 'secure';

interface AppHeaderProps {
  action?: HeaderAction;
  onActionPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ action, onActionPress }) => {
  const { colors, iconSize } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Image source={require('../assets/main-logo.png')} style={styles.logo} resizeMode="contain" />

        {action === 'notifications' && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onActionPress}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={iconSize.md} color={colors.primary} />
          </TouchableOpacity>
        )}

        {action === 'secure' && (
          <View style={styles.secureChip}>
            <AppText variant="caption" style={styles.secureText}>
              Secure payments
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.accentLine} />
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, iconSize }: AppTheme) =>
  StyleSheet.create({
    wrap: {
      backgroundColor: colors.surface,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    logo: {
      height: iconSize.xl*2,
      width: iconSize.xl * 5,
    },
    iconButton: {
      width: spacing.xxl,
      height: spacing.xxl,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.infoLight,
    },
    secureChip: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: colors.successLight,
    },
    secureText: {
      color: colors.success,
    },
    accentLine: {
      height: spacing.xs / 2,
      backgroundColor: colors.primary,
    },
  });