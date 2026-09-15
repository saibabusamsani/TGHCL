export const colors = {
  primary: '#1B3A6B',
  primaryDark: '#12294D',
  secondary: '#6B6B6B',

  background: '#F1F3F6',
  surface: '#FFFFFF',

  text: '#1A1A1A',
  textLight: '#6B6B6B',
  textInverse: '#FFFFFF',

  border: '#E0E0E0',

  success: '#43A047',
  error: '#E53935',
  warning: '#FB8C00',

  accent: '#C9982E',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  tileBackground: '#E6F2EE',
  tileIcon: '#1F6E5C',
  avatarBackground: '#9A6B1F',
  errorLight: '#FFF0F0',

  successLight: '#E7F5E9',
  warningLight: '#FFF4E5',
  infoLight: '#EAF1FB',
  neutralLight: '#F2F2F2',
  ledgerBg: '#F7F9FC',
  chipBg: 'rgba(255,255,255,0.16)',
} as const;

export const darkColors: Record<keyof typeof colors, string> = {
  primary: '#3D7BFF',
  primaryDark: '#0A1128',
  secondary: '#8B93A7',

  background: '#0A0E1A',
  surface: '#101627',

  text: '#F5F7FA',
  textLight: '#8B93A7',
  textInverse: '#FFFFFF',

  border: '#232B42',

  success: '#4CD97B',
  error: '#FF6B6B',
  warning: '#FFB238',

  accent: '#F5A623',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  tileBackground: '#12331F',
  tileIcon: '#4CD97B',
  avatarBackground: '#F5A623',
  errorLight: '#2E1418',

  successLight: '#0F2818',
  warningLight: '#2E2008',
  infoLight: '#141E3A',
  neutralLight: '#171E33',
  ledgerBg: '#0D1220',
  chipBg: 'rgba(255,255,255,0.08)',
};

export const gradients = {
  primary: ['#1B3A6B', '#12294D'],
  success: ['#66BB6A', '#43A047'],
  error: ['#EF5350', '#E53935'],
  surface: ['#FFFFFF', '#FFFFFF'],
  warning: ['#FFD54F', '#F9A825'],
} as const;

export const darkGradients: Record<keyof typeof gradients, readonly string[]> = {
  primary: ['#3D7BFF', '#0A1128'],
  success: ['#4CD97B', '#2FAE5C'],
  error: ['#FF6B6B', '#E53935'],
  surface: ['#101627', '#101627'],
  warning: ['#FFE082', '#FFB300'],
  
};

export type ColorKey = keyof typeof colors;
export type GradientKey = keyof typeof gradients;