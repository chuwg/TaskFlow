import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useTheme } from './useTheme.js';

interface AnimatedThemeValues {
  backgroundColor: Animated.Value;
  textColor: Animated.Value;
  borderColor: Animated.Value;
}

export const useThemedAnimation = () => {
  const { theme, isDarkMode } = useTheme();
  const animatedValues = useRef<AnimatedThemeValues>({
    backgroundColor: new Animated.Value(0),
    textColor: new Animated.Value(0),
    borderColor: new Animated.Value(0),
  }).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValues.backgroundColor, {
        toValue: isDarkMode ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.textColor, {
        toValue: isDarkMode ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.borderColor, {
        toValue: isDarkMode ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isDarkMode]);

  const interpolateColor = (
    animatedValue: Animated.Value,
    lightColor: string,
    darkColor: string
  ) => {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lightColor, darkColor],
    });
  };

  const animatedColors = {
    background: interpolateColor(
      animatedValues.backgroundColor,
      theme.colors.background,
      theme.colors.surface
    ),
    text: interpolateColor(
      animatedValues.textColor,
      theme.colors.onBackground,
      theme.colors.onSurface
    ),
    border: interpolateColor(
      animatedValues.borderColor,
      theme.colors.border,
      theme.colors.outline
    ),
  };

  const createSpringAnimation = (
    value: number,
    config?: Partial<Animated.SpringAnimationConfig>
  ) => {
    const springValue = new Animated.Value(0);
    
    Animated.spring(springValue, {
      toValue: value,
      useNativeDriver: true,
      ...config,
    }).start();

    return springValue;
  };

  return {
    animatedColors,
    createSpringAnimation,
  };
};
