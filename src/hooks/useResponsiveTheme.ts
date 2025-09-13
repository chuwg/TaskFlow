import { useTheme } from './useTheme';
import { useResponsive } from './useResponsive';
import type { CustomTheme } from '@/types/theme';

export const useResponsiveTheme = () => {
  const { theme } = useTheme();
  const { breakpoint, isPortrait, getResponsiveValue, getSpacing } = useResponsive();

  const responsiveTheme: CustomTheme = {
    ...theme,
    spacing: {
      xs: getSpacing('xs'),
      sm: getSpacing('sm'),
      md: getSpacing('md'),
      lg: getSpacing('lg'),
      xl: getSpacing('xl'),
    },
    fontSizes: {
      xs: getResponsiveValue({ xs: 12, sm: 12, md: 13, lg: 14, xl: 14 }),
      sm: getResponsiveValue({ xs: 14, sm: 14, md: 15, lg: 16, xl: 16 }),
      md: getResponsiveValue({ xs: 16, sm: 16, md: 17, lg: 18, xl: 18 }),
      lg: getResponsiveValue({ xs: 18, sm: 18, md: 20, lg: 22, xl: 22 }),
      xl: getResponsiveValue({ xs: 20, sm: 20, md: 24, lg: 26, xl: 26 }),
      xxl: getResponsiveValue({ xs: 24, sm: 24, md: 28, lg: 32, xl: 32 }),
    },
    radii: {
      none: 0,
      sm: getResponsiveValue({ xs: 4, sm: 4, md: 6, lg: 8, xl: 8 }),
      md: getResponsiveValue({ xs: 8, sm: 8, md: 12, lg: 16, xl: 16 }),
      lg: getResponsiveValue({ xs: 16, sm: 16, md: 24, lg: 32, xl: 32 }),
      full: 9999,
    },
  };

  const getResponsiveStyles = (styles: {
    [key in typeof breakpoint]?: any;
  }) => {
    return getResponsiveValue(styles);
  };

  const getResponsiveLayout = (defaultColumns: number = 1) => {
    const columns = getResponsiveValue({
      xs: defaultColumns,
      sm: defaultColumns,
      md: defaultColumns + 1,
      lg: defaultColumns + 2,
      xl: defaultColumns + 2,
    });

    const gap = getSpacing(
      getResponsiveValue({ xs: 'sm', sm: 'md', md: 'lg', lg: 'xl', xl: 'xl' })
    );

    return {
      columns,
      gap,
      isPortrait,
    };
  };

  return {
    theme: responsiveTheme,
    getResponsiveStyles,
    getResponsiveLayout,
  };
};
