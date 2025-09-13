import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Platform } from 'react-native';
import { lightColors, darkColors } from './colors';
import type { CustomTheme, ThemePreset } from '@/types/theme';

// 시스템 기본 폰트 사용
const systemFont = Platform.select({
  ios: 'System',
  android: 'System',
  default: 'System',
});

export const DEFAULT_TYPOGRAPHY = {
  displayLarge: {
    fontFamily: systemFont,
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: systemFont,
    fontSize: 45,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: systemFont,
    fontSize: 36,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: systemFont,
    fontSize: 32,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: systemFont,
    fontSize: 28,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: systemFont,
    fontSize: 24,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: systemFont,
    fontSize: 22,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: systemFont,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: systemFont,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelLarge: {
    fontFamily: systemFont,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: systemFont,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: systemFont,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  bodyLarge: {
    fontFamily: systemFont,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontFamily: systemFont,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: systemFont,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
};

export const DEFAULT_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const DEFAULT_FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const DEFAULT_RADII = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
};

export const DEFAULT_LIGHT_THEME: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
  fonts: DEFAULT_TYPOGRAPHY,
  spacing: DEFAULT_SPACING,
  fontWeights: DEFAULT_FONT_WEIGHTS,
  radii: DEFAULT_RADII,
};

export const DEFAULT_DARK_THEME: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
  fonts: DEFAULT_TYPOGRAPHY,
  spacing: DEFAULT_SPACING,
  fontWeights: DEFAULT_FONT_WEIGHTS,
  radii: DEFAULT_RADII,
};

export const DEFAULT_THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: '기본 테마',
    colors: {
      primary: lightColors.primary,
      secondary: lightColors.secondary,
    },
  },
  {
    id: 'nature',
    name: '자연 테마',
    colors: {
      primary: '#4CAF50',
      secondary: '#8BC34A',
    },
  },
  {
    id: 'ocean',
    name: '바다 테마',
    colors: {
      primary: '#0288D1',
      secondary: '#03A9F4',
    },
  },
  {
    id: 'sunset',
    name: '선셋 테마',
    colors: {
      primary: '#F44336',
      secondary: '#FF9800',
    },
  },
];