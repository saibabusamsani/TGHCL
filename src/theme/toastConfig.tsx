import React from 'react';
import { View, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { AppText } from '../components/AppText';
import { AppTheme } from './ThemeProvider';

const TOAST_CONFIG = {
  error: { icon: 'x-circle', accent: 'error' as const },
  success: { icon: 'check-circle', accent: 'success' as const },
  warning: { icon: 'alert-triangle', accent: 'warning' as const },
};


export const buildToastConfig = (theme: AppTheme) => {
  const { colors, iconSize } = theme;

  const renderToast = (type: keyof typeof TOAST_CONFIG) => (props: any) => {
    const { icon, accent } = TOAST_CONFIG[type];
    const accentColor = colors[accent];
    const styles = createStyles(theme, accentColor);

    return (
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Feather name={icon as any} size={iconSize.md} color={accentColor} />
        </View>

        <View style={styles.textWrapper}>
          <AppText variant="subtitle" color={colors.text} numberOfLines={1}>
            {props.text1}
          </AppText>
          {!!props.text2 && (
            <AppText
              variant="caption"
              color={colors.textLight}
              style={styles.caption}
              numberOfLines={2}
            >
              {props.text2}
            </AppText>
          )}
        </View>

        <View style={styles.accentBar} />
      </View>
    );
  };

  return {
    error: renderToast('error'),
    success: renderToast('success'),
    warning: renderToast('warning'),
  };
};

const createStyles = (theme: AppTheme, accentColor: string) => {
  const { colors, spacing, radius, shadow, iconSize } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: radius.lg,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      marginHorizontal: spacing.md,
      width: '92%',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      ...shadow.lg,
    },
    iconWrapper: {
      width: iconSize.xl,
      height: iconSize.xl,
      borderRadius: radius.full,
      backgroundColor: `${accentColor}1A`, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    textWrapper: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    caption: {
      marginTop: spacing.xs,
    },
    accentBar: {
      width: spacing.xs,
      height: '60%',
      borderRadius: radius.full,
      backgroundColor: accentColor,
      marginLeft: spacing.xs,
    },
  });
};