import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useFontScaling } from '@/hooks/useFontScaling';
import type { fontConfig } from '@/constants/fonts';

interface TextProps {
  children: React.ReactNode;
  variant?: keyof typeof fontConfig;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'bodyMedium',
  color,
  align,
  style,
  numberOfLines,
}) => {
  const { theme } = useTheme();
  const { getScaledFontStyle } = useFontScaling();

  const fontStyle = getScaledFontStyle(variant);

  return (
    <RNText
      style={[
        fontStyle,
        {
          color: color || theme.colors.onBackground,
          textAlign: align,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};
