
import React from 'react';
import {Text, TextProps} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {
  fontFamily,
  type VariantKey,
} from '../theme';

interface Props extends TextProps {
  variant?: VariantKey;
  weight?: keyof typeof fontFamily;
  color?: string;
}

export function AppText({
  variant = 'body',
  weight,
  color,
  style,
  ...props
}: Props) {
  const {typography, colors} = useTheme();

  return (
    <Text
      {...props}
      style={[
        typography.variants[variant],
        weight && {
          fontFamily: fontFamily[weight],
        },
        {color: color ?? colors.text},
        style,
      ]}
    />
  );
}
