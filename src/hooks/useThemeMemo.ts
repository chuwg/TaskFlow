import { useMemo } from 'react';
import { useTheme } from './useTheme';
import type { CustomTheme } from '@/types/theme';

type StyleGenerator<T> = (theme: CustomTheme) => T;

export const useThemeMemo = <T>(styleGenerator: StyleGenerator<T>): T => {
  const { theme } = useTheme();
  
  return useMemo(() => styleGenerator(theme), [
    theme.colors,
    theme.spacing,
    theme.fontSizes,
    theme.fontWeights,
    theme.radii,
  ]);
};
