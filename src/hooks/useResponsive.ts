import { useWindowDimensions } from 'react-native';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const breakpoints = {
  xs: 0,
  sm: 360,
  md: 600,
  lg: 840,
  xl: 1200,
};

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const getBreakpoint = (): Breakpoint => {
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const isPortrait = height > width;
  const currentBreakpoint = getBreakpoint();

  const spacing = {
    xs: 4,
    sm: 8,
    md: currentBreakpoint === 'xs' ? 12 : 16,
    lg: currentBreakpoint === 'xs' ? 16 : currentBreakpoint === 'sm' ? 20 : 24,
    xl: currentBreakpoint === 'xs' ? 20 : currentBreakpoint === 'sm' ? 24 : 32,
  };

  const getSpacing = (size: keyof typeof spacing) => spacing[size];

  const getResponsiveValue = <T>(values: { [key in Breakpoint]?: T }): T => {
    const breakpointOrder: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

    for (let i = currentIndex; i < breakpointOrder.length; i++) {
      const value = values[breakpointOrder[i]];
      if (value !== undefined) return value;
    }

    return values.xs!;
  };

  return {
    breakpoint: currentBreakpoint,
    isPortrait,
    width,
    height,
    spacing,
    getSpacing,
    getResponsiveValue,
  };
};
