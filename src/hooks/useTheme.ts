import { useCallback } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import type { ThemePreset } from '@/types/theme';

export const useTheme = () => {
  const {
    theme,
    themeMode,
    currentPreset,
    presets,
    setThemeMode,
    setPrimaryColor,
    setThemePreset,
    addThemePreset,
    removeThemePreset,
  } = useThemeContext();

  const isDarkMode = theme.colors.background === '#121212';

  const getSpacing = useCallback(
    (size: keyof typeof theme.spacing) => theme.spacing[size],
    [theme.spacing]
  );

  const getFontSize = useCallback(
    (size: keyof typeof theme.fontSizes) => theme.fontSizes[size],
    [theme.fontSizes]
  );

  const getColor = useCallback(
    (color: keyof typeof theme.colors) => theme.colors[color],
    [theme.colors]
  );

  const createThemePreset = useCallback(
    (name: string, colors: Partial<typeof theme.colors>): ThemePreset => {
      const id = name.toLowerCase().replace(/\s+/g, '-');
      return {
        id,
        name,
        colors,
      };
    },
    []
  );

  const applyThemePreset = useCallback(
    (presetId: string) => {
      const preset = presets.find((p) => p.id === presetId);
      if (preset) {
        setThemePreset(preset);
      }
    },
    [presets, setThemePreset]
  );

  return {
    theme,
    themeMode,
    isDarkMode,
    currentPreset,
    presets,
    setThemeMode,
    setPrimaryColor,
    setThemePreset,
    getSpacing,
    getFontSize,
    getColor,
    createThemePreset,
    applyThemePreset,
    addThemePreset,
    removeThemePreset,
    // 직접 접근을 위한 속성들
    colors: theme.colors,
    spacing: theme.spacing,
  };
};
