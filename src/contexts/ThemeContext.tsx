import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import type { CustomTheme, ThemeContextType, ThemeMode, ThemePreset } from '@/types/theme';
import {
  DEFAULT_LIGHT_THEME,
  DEFAULT_DARK_THEME,
  DEFAULT_THEME_PRESETS,
} from '@/constants/theme';
import { lightColors, darkColors } from '@/constants/colors';
import { ThemeStorage } from '@/services/storage';

const defaultThemeContext: ThemeContextType = {
  theme: DEFAULT_LIGHT_THEME,
  themeMode: 'system',
  currentPreset: DEFAULT_THEME_PRESETS[0],
  presets: DEFAULT_THEME_PRESETS,
  setThemeMode: () => {},
  setPrimaryColor: () => {},
  setThemePreset: () => {},
  addThemePreset: () => {},
  removeThemePreset: () => {},
  toggleUseSystemFont: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_LIGHT_THEME.colors.primary);
  const [useSystemFont, setUseSystemFont] = useState(true);
  const [currentPreset, setCurrentPreset] = useState<ThemePreset>(DEFAULT_THEME_PRESETS[0]);
  const [presets, setPresets] = useState<ThemePreset[]>(DEFAULT_THEME_PRESETS);

  // 저장된 설정 불러오기
  useEffect(() => {
    const loadStoredSettings = async () => {
      const [
        storedThemeMode,
        storedPrimaryColor,
        storedPresets,
        storedCurrentPreset,
        storedUseSystemFont,
      ] = await Promise.all([
        ThemeStorage.getThemeMode(),
        ThemeStorage.getPrimaryColor(),
        ThemeStorage.getThemePresets(),
        ThemeStorage.getCurrentPreset(),
        ThemeStorage.getUseSystemFont(),
      ]);

      if (storedThemeMode) setThemeMode(storedThemeMode);
      if (storedPrimaryColor) setPrimaryColor(storedPrimaryColor);
      if (storedPresets) setPresets(storedPresets);
      if (storedCurrentPreset) setCurrentPreset(storedCurrentPreset);
      if (storedUseSystemFont !== null) setUseSystemFont(storedUseSystemFont);
    };

    loadStoredSettings();
  }, []); // useEffect 닫는 괄호 추가

  const getBaseTheme = (): CustomTheme => {
    const isDark =
      themeMode === 'system' ? colorScheme === 'dark' : themeMode === 'dark';
    return isDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
  };

  const getTheme = (): CustomTheme => {
    // 기본 다크모드 여부 확인
    const systemIsDark = themeMode === 'system' ? colorScheme === 'dark' : themeMode === 'dark';
    
    // 프리셋의 배경색을 기준으로 다크모드 여부 재계산
    const presetBackground = currentPreset?.colors?.background;
    const isDark = presetBackground 
      ? isColorDark(presetBackground)
      : systemIsDark;

    // 기본 테마 선택
    const baseTheme = isDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
    const baseColors = isDark ? darkColors : lightColors;
    
    // 최종 테마 색상 계산
    const themeColors = {
      ...baseColors,
      ...baseTheme.colors,
      primary: primaryColor,
      ...(currentPreset?.colors || {}),
    };

    // 텍스트 색상 자동 조정
    const textColors = getTextColors(themeColors.background);
    
    return {
      ...baseTheme,
      colors: {
        ...themeColors,
        onBackground: textColors.primary,
        onSurface: textColors.primary,
        onSurfaceVariant: textColors.secondary,
      },
    };
  };

  // 색상의 명도를 계산하여 다크모드 여부 판단
  const isColorDark = (color: string): boolean => {
    // HEX to RGB 변환
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // 상대 휘도 계산
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  // 배경색을 기준으로 텍스트 색상 계산
  const getTextColors = (backgroundColor: string) => {
    const isDark = isColorDark(backgroundColor);
    return {
      primary: isDark ? '#FFFFFF' : '#000000',
      secondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    };
  };

  const handleSetThemePreset = async (preset: ThemePreset) => {
    // 현재 테마 모드에 맞게 프리셋 조정
    const isDark = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');
    const baseTheme = isDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
    const baseColors = isDark ? darkColors : lightColors;

    const adjustedPreset: ThemePreset = {
      ...preset,
      colors: {
        ...baseColors,
        ...preset.colors,
        background: preset.colors.background || baseTheme.colors.background,
        surface: preset.colors.surface || baseTheme.colors.surface,
        border: preset.colors.border || baseTheme.colors.border,
      }
    };

    setCurrentPreset(adjustedPreset);
    if (adjustedPreset.colors.primary) {
      setPrimaryColor(adjustedPreset.colors.primary);
    }
    
    await ThemeStorage.setCurrentPreset(adjustedPreset);
    if (adjustedPreset.colors.primary) {
      await ThemeStorage.setPrimaryColor(adjustedPreset.colors.primary);
    }
  };

  const handleAddThemePreset = async (preset: ThemePreset) => {
    const newPresets = [...presets, preset];
    setPresets(newPresets);
    await ThemeStorage.setThemePresets(newPresets);
  };

  const handleRemoveThemePreset = async (presetId: string) => {
    if (presetId === 'default') return; // 기본 프리셋은 삭제 불가
    const newPresets = presets.filter((preset) => preset.id !== presetId);
    setPresets(newPresets);
    await ThemeStorage.setThemePresets(newPresets);
    if (currentPreset?.id === presetId) {
      await handleSetThemePreset(DEFAULT_THEME_PRESETS[0]);
    }
  };

  const toggleUseSystemFont = async () => {
    const newValue = !useSystemFont;
    setUseSystemFont(newValue);
    await ThemeStorage.setUseSystemFont(newValue);
  };

  // 테마 모드 변경 시 저장 및 프리셋 조정
  useEffect(() => {
    const updateThemeMode = async () => {
      await ThemeStorage.setThemeMode(themeMode);
      
      // 현재 프리셋이 있다면 테마 모드에 맞게 조정
      if (currentPreset) {
        const isDark = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');
        const baseTheme = isDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
        const baseColors = isDark ? darkColors : lightColors;

        // 프리셋의 기본 색상은 유지하면서 배경색과 보조 색상은 현재 테마 모드에 맞게 조정
        const adjustedPreset: ThemePreset = {
          ...currentPreset,
          colors: {
            ...baseColors,
            ...currentPreset.colors,
            background: baseTheme.colors.background,
            surface: baseTheme.colors.surface,
            border: baseTheme.colors.border,
          }
        };

        await handleSetThemePreset(adjustedPreset);
      }
    };

    updateThemeMode();
  }, [themeMode, colorScheme]);

  // 주 색상 변경 시 저장
  useEffect(() => {
    ThemeStorage.setPrimaryColor(primaryColor);
  }, [primaryColor]);

  const value: ThemeContextType = {
    theme: getTheme(),
    themeMode,
    currentPreset,
    presets,
    setThemeMode,
    setPrimaryColor,
    setThemePreset: handleSetThemePreset,
    addThemePreset: handleAddThemePreset,
    removeThemePreset: handleRemoveThemePreset,
    toggleUseSystemFont,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};