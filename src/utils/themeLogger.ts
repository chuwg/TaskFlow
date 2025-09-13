import type { CustomTheme } from '@/types/theme';

const THEME_LOGGER_ENABLED = __DEV__;

export const themeLogger = {
  logThemeChange: (
    prevTheme: CustomTheme,
    nextTheme: CustomTheme,
    source: string
  ) => {
    if (!THEME_LOGGER_ENABLED) return;

    console.group(`Theme Change (${source})`);
    
    // 색상 변경 로깅
    const colorChanges = Object.entries(nextTheme.colors).filter(
      ([key, value]) => prevTheme.colors[key] !== value
    );
    
    if (colorChanges.length > 0) {
      console.group('Color Changes:');
      colorChanges.forEach(([key, value]) => {
        console.log(
          `%c${key}%c: ${prevTheme.colors[key]} → ${value}`,
          'font-weight: bold',
          'font-weight: normal'
        );
      });
      console.groupEnd();
    }

    // 간격 변경 로깅
    const spacingChanges = Object.entries(nextTheme.spacing).filter(
      ([key, value]) => prevTheme.spacing[key] !== value
    );
    
    if (spacingChanges.length > 0) {
      console.group('Spacing Changes:');
      spacingChanges.forEach(([key, value]) => {
        console.log(
          `%c${key}%c: ${prevTheme.spacing[key]} → ${value}`,
          'font-weight: bold',
          'font-weight: normal'
        );
      });
      console.groupEnd();
    }

    // 폰트 크기 변경 로깅
    const fontSizeChanges = Object.entries(nextTheme.fontSizes).filter(
      ([key, value]) => prevTheme.fontSizes[key] !== value
    );
    
    if (fontSizeChanges.length > 0) {
      console.group('Font Size Changes:');
      fontSizeChanges.forEach(([key, value]) => {
        console.log(
          `%c${key}%c: ${prevTheme.fontSizes[key]} → ${value}`,
          'font-weight: bold',
          'font-weight: normal'
        );
      });
      console.groupEnd();
    }

    console.groupEnd();
  },

  logThemeError: (error: Error, context: string) => {
    if (!THEME_LOGGER_ENABLED) return;

    console.group('Theme Error');
    console.error(`Context: ${context}`);
    console.error(error);
    console.groupEnd();
  },

  logThemeWarning: (message: string, details?: any) => {
    if (!THEME_LOGGER_ENABLED) return;

    console.group('Theme Warning');
    console.warn(message);
    if (details) {
      console.warn('Details:', details);
    }
    console.groupEnd();
  },
};
