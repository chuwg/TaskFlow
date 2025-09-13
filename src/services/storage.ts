import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode, ThemePreset } from '@/types/theme';

const STORAGE_KEYS = {
  THEME_MODE: '@taskflow/theme-mode',
  PRIMARY_COLOR: '@taskflow/primary-color',
  THEME_PRESETS: '@taskflow/theme-presets',
  CURRENT_PRESET: '@taskflow/current-preset',
  USE_SYSTEM_FONT: '@taskflow/use-system-font',
};

export const ThemeStorage = {
  async getThemeMode(): Promise<ThemeMode | null> {
    try {
      const mode = await (AsyncStorage as any).getItem(STORAGE_KEYS.THEME_MODE);
      return mode as ThemeMode | null;
    } catch (error) {
      console.error('Failed to get theme mode:', error);
      return null;
    }
  },

  async setThemeMode(mode: ThemeMode): Promise<void> {
    try {
      await (AsyncStorage as any).setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  },

  async getPrimaryColor(): Promise<string | null> {
    try {
      return await (AsyncStorage as any).getItem(STORAGE_KEYS.PRIMARY_COLOR);
    } catch (error) {
      console.error('Failed to get primary color:', error);
      return null;
    }
  },

  async setPrimaryColor(color: string): Promise<void> {
    try {
      await (AsyncStorage as any).setItem(STORAGE_KEYS.PRIMARY_COLOR, color);
    } catch (error) {
      console.error('Failed to save primary color:', error);
    }
  },

  async getThemePresets(): Promise<ThemePreset[] | null> {
    try {
      const presetsJson = await (AsyncStorage as any).getItem(STORAGE_KEYS.THEME_PRESETS);
      return presetsJson ? JSON.parse(presetsJson) : null;
    } catch (error) {
      console.error('Failed to get theme presets:', error);
      return null;
    }
  },

  async setThemePresets(presets: ThemePreset[]): Promise<void> {
    try {
      await (AsyncStorage as any).setItem(STORAGE_KEYS.THEME_PRESETS, JSON.stringify(presets));
    } catch (error) {
      console.error('Failed to save theme presets:', error);
    }
  },

  async getCurrentPreset(): Promise<ThemePreset | null> {
    try {
      const presetJson = await (AsyncStorage as any).getItem(STORAGE_KEYS.CURRENT_PRESET);
      return presetJson ? JSON.parse(presetJson) : null;
    } catch (error) {
      console.error('Failed to get current preset:', error);
      return null;
    }
  },

  async setCurrentPreset(preset: ThemePreset): Promise<void> {
    try {
      await (AsyncStorage as any).setItem(STORAGE_KEYS.CURRENT_PRESET, JSON.stringify(preset));
    } catch (error) {
      console.error('Failed to save current preset:', error);
    }
  },

  async getUseSystemFont(): Promise<boolean | null> {
    try {
      const value = await (AsyncStorage as any).getItem(STORAGE_KEYS.USE_SYSTEM_FONT);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Failed to get system font setting:', error);
      return null;
    }
  },

  async setUseSystemFont(useSystemFont: boolean): Promise<void> {
    try {
      await (AsyncStorage as any).setItem(
        STORAGE_KEYS.USE_SYSTEM_FONT,
        JSON.stringify(useSystemFont)
      );
    } catch (error) {
      console.error('Failed to save system font setting:', error);
    }
  },
};
