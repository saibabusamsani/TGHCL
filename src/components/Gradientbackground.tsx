import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme';
import { GradientKey } from '../theme/colors';

interface GradientBackgroundProps {
  gradient?: GradientKey;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  gradient = 'primary',
  style,
  children,
}) => {
  const { gradients } = useTheme();

  return (
    <LinearGradient
      colors={gradients[gradient] as unknown as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};