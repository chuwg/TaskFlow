import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained' | 'contained-tonal';
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  onPress,
  children,
  disabled = false,
  loading = false,
  icon,
  style,
  size = 'medium',
  fullWidth = false,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radii.md,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (size) {
      case 'small':
        baseStyle.height = 32;
        return baseStyle;
      case 'large':
        baseStyle.height = 48;
        return baseStyle;
      default:
        baseStyle.height = 40;
        return baseStyle;
    }
  };

  const getContentStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallContent;
      case 'large':
        return styles.largeContent;
      default:
        return styles.mediumContent;
    }
  };

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[getButtonStyle(), style]}
      contentStyle={getContentStyle()}
      theme={{
        colors: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
          error: theme.colors.error,
        },
      }}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  smallContent: {
    height: 32,
    paddingHorizontal: 12,
  },
  mediumContent: {
    height: 40,
    paddingHorizontal: 16,
  },
  largeContent: {
    height: 48,
    paddingHorizontal: 24,
  },
});