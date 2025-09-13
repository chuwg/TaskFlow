import React, { useMemo } from 'react';
import { ThemeProvider as OriginalThemeProvider } from '@/contexts/ThemeContext';
import type { CustomTheme } from '@/types/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  updateInterval?: number; // ms 단위, 테마 업데이트 제한 간격
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  updateInterval = 16, // 약 60fps
}) => {
  // 테마 업데이트 스로틀링
  const throttledChildren = useMemo(() => {
    let lastUpdate = 0;
    let scheduledUpdate: number | null = null;

    const throttle = (fn: () => void) => {
      const now = Date.now();
      
      if (now - lastUpdate >= updateInterval) {
        fn();
        lastUpdate = now;
      } else if (!scheduledUpdate) {
        scheduledUpdate = window.setTimeout(() => {
          fn();
          lastUpdate = Date.now();
          scheduledUpdate = null;
        }, updateInterval - (now - lastUpdate));
      }
    };

    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) return child;

      return React.cloneElement(child, {
        onThemeChange: (theme: CustomTheme) => {
          throttle(() => {
            if (child.props.onThemeChange) {
              child.props.onThemeChange(theme);
            }
          });
        },
      });
    });
  }, [children, updateInterval]);

  return (
    <OriginalThemeProvider>
      {throttledChildren}
    </OriginalThemeProvider>
  );
};
