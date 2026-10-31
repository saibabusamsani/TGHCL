
import {Platform, TextStyle} from 'react-native';

export const fontFamily = {
  regular:
    Platform.OS === 'ios'
      ? 'Inter18pt-Regular'
      : 'Inter_18pt-Regular',

  medium:
    Platform.OS === 'ios'
      ? 'Inter18pt-Medium'
      : 'Inter_18pt-Medium',

  semiBold:
    Platform.OS === 'ios'
      ? 'Inter18pt-SemiBold'
      : 'Inter_18pt-SemiBold',

  bold:
    Platform.OS === 'ios'
      ? 'Inter18pt-Bold'
      : 'Inter_18pt-Bold',
} as const;

export const fontSize = {
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 19,
  xxxl: 25,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  sm: 14,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 27,
  xxxl: 32,
} as const;

export const variants = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xxxl,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.xxl,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
  },
} satisfies Record<string, TextStyle>;

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  variants,
};

export type FontSizeKey = keyof typeof fontSize;
export type FontWeightKey = keyof typeof fontWeight;
export type VariantKey = keyof typeof variants;
