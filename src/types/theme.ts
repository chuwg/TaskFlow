import type { MD3Theme } from 'react-native-paper';
import type { MD3Colors } from 'react-native-paper';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // 추가 상태 색상
  success: string;
  warning: string;
  info: string;
  
  // 추가 컴포넌트 색상
  card: string;
  border: string;
  
  // 투명도가 있는 색상
  overlay: string;
  backdrop: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeFontWeights {
  light: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
}

export interface ThemeRadii {
  none: number;
  sm: number;
  md: number;
  lg: number;
  full: number;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: string;
}

export interface CustomTheme extends Omit<MD3Theme, 'colors'> {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  fontWeights: ThemeFontWeights;
  radii: ThemeRadii;
  fonts: {
    displayLarge: ThemeTypography;
    displayMedium: ThemeTypography;
    displaySmall: ThemeTypography;
    headlineLarge: ThemeTypography;
    headlineMedium: ThemeTypography;
    headlineSmall: ThemeTypography;
    titleLarge: ThemeTypography;
    titleMedium: ThemeTypography;
    titleSmall: ThemeTypography;
    labelLarge: ThemeTypography;
    labelMedium: ThemeTypography;
    labelSmall: ThemeTypography;
    bodyLarge: ThemeTypography;
    bodyMedium: ThemeTypography;
    bodySmall: ThemeTypography;
  };
}

export interface ThemePreset {
  id: string;
  name: string;
  colors: Partial<ThemeColors>;
}