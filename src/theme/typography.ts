export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
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
  regular: '500',
  medium: '600',
  semibold: '700',
  bold: '800',
} as const;

export const lineHeight = {
  sm: 11,
  md: 17,
  lg: 19,
  xl: 23,
  xxl: 25,
  xxxl: 31,
} as const;


export const variants = {
  h1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: lineHeight.xxxl,
  },
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: lineHeight.xxl,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: lineHeight.lg,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
    lineHeight: lineHeight.md,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: lineHeight.sm,
  },
} as const;


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