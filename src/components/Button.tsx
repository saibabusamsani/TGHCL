import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppTheme, GradientKey, useTheme, useThemedStyles } from '../theme';
import { AppText } from './AppText';

type ButtonSize = 'sm' | 'md' | 'lg';

interface SizeConfig {
  paddingVerticalKey: 'xs' | 'sm' | 'md';
  paddingHorizontalKey: 'sm' | 'lg' | 'xl';
  titleVariant: 'body' | 'subtitle' | 'caption';
  iconGapKey: 'xs' | 'sm';
}

const SIZE_CONFIG: Record<ButtonSize, SizeConfig> = {
  sm: { paddingVerticalKey: 'xs', paddingHorizontalKey: 'sm', titleVariant: 'caption', iconGapKey: 'xs' },
  md: { paddingVerticalKey: 'sm', paddingHorizontalKey: 'lg', titleVariant: 'body', iconGapKey: 'xs' },
  lg: { paddingVerticalKey: 'md', paddingHorizontalKey: 'xl', titleVariant: 'subtitle', iconGapKey: 'sm' },
};

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  gradient?: GradientKey;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  gradient = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const { colors, gradients } = useTheme();
  const config = SIZE_CONFIG[size];
  const isDisabled = disabled || loading;
  const styles = useThemedStyles(createStyles(config));

  const renderIcon = (position: 'left' | 'right') => {
    if (!icon || iconPosition !== position) return null;
    return <View style={position === 'left' ? styles.iconLeft : styles.iconRight}>{icon}</View>;
  };

  if (loading) {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.85}>
        <LinearGradient
          colors={gradients[gradient] as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, isDisabled && styles.disabled, style]}
        >
          <ActivityIndicator color={colors.white} />
          {loadingText ? (
            <AppText variant={config.titleVariant} color={colors.white} style={[styles.loadingText, textStyle]}>
              {loadingText}
            </AppText>
          ) : null}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.85}>
      <LinearGradient
        colors={gradients[gradient] as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, isDisabled && styles.disabled, style]}
      >
        {renderIcon('left')}
        <AppText variant={config.titleVariant} color={colors.white} style={textStyle} numberOfLines={1}>
          {title}
        </AppText>
        {renderIcon('right')}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const createStyles =
  (config: SizeConfig) =>
  ({ spacing, radius, isLandscape, isTablet }: AppTheme) =>
    StyleSheet.create({
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing[config.paddingVerticalKey],
        paddingHorizontal: spacing[config.paddingHorizontalKey],
        borderRadius: radius.md,
        maxWidth: isTablet
          ? spacing.xxl * spacing.xl
          : isLandscape
          ? spacing.xxl * spacing.xl * 0.8
          : undefined,
        alignSelf: isLandscape || isTablet ? 'center' : 'flex-start',
      },
      iconLeft: {
        marginRight: spacing[config.iconGapKey],
      },
      iconRight: {
        marginLeft: spacing[config.iconGapKey],
      },
      loadingText: {
        marginLeft: spacing[config.iconGapKey],
      },
      disabled: {
        opacity: 0.5,
      },
    });