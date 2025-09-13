import type { ThemePreset } from '@/types/theme';
import { palette } from './colors';

export const themePresets: ThemePreset[] = [
  {
    id: 'default',
    name: '기본 테마',
    colors: {
      primary: palette.purple.main,
      secondary: palette.blue.main,
      success: palette.green.main,
      warning: palette.orange.main,
      info: palette.blue.main,
    },
  },
  {
    id: 'nature',
    name: '자연 테마',
    colors: {
      primary: palette.green.main,
      secondary: '#8BC34A',
      success: '#4CAF50',
      warning: '#FFC107',
      info: '#009688',
      surface: '#F5F8F5',
      background: '#FFFFFF',
      card: '#FFFFFF',
      border: '#E8F5E9',
    },
  },
  {
    id: 'ocean',
    name: '바다 테마',
    colors: {
      primary: '#0288D1',
      secondary: '#03A9F4',
      success: '#00BCD4',
      warning: '#FFC107',
      info: '#00ACC1',
      surface: '#E1F5FE',
      background: '#FFFFFF',
      card: '#FFFFFF',
      border: '#B3E5FC',
    },
  },
  {
    id: 'sunset',
    name: '선셋 테마',
    colors: {
      primary: '#F44336',
      secondary: '#FF9800',
      success: '#4CAF50',
      warning: '#FFC107',
      info: '#2196F3',
      surface: '#FFF3E0',
      background: '#FFFFFF',
      card: '#FFFFFF',
      border: '#FFE0B2',
    },
  },
  {
    id: 'modern',
    name: '모던 테마',
    colors: {
      primary: '#212121',
      secondary: '#757575',
      success: '#4CAF50',
      warning: '#FFC107',
      info: '#2196F3',
      surface: '#FAFAFA',
      background: '#FFFFFF',
      card: '#FFFFFF',
      border: '#EEEEEE',
    },
  },
  {
    id: 'minimal',
    name: '미니멀 테마',
    colors: {
      primary: '#455A64',
      secondary: '#78909C',
      success: '#81C784',
      warning: '#FFB74D',
      info: '#64B5F6',
      surface: '#FFFFFF',
      background: '#FAFAFA',
      card: '#FFFFFF',
      border: '#ECEFF1',
    },
  },
];

export const darkThemePresets: ThemePreset[] = themePresets.map(preset => ({
  ...preset,
  id: `${preset.id}-dark`,
  name: `${preset.name} (다크)`,
  colors: {
    ...preset.colors,
    surface: '#1E1E1E',
    background: '#121212',
    card: '#1E1E1E',
    border: '#2C2C2C',
  },
}));
