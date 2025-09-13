import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  style,
  elevation = 1,
}) => {
  const { theme } = useTheme();

  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      elevation={elevation}
    >
      {title && (
        <Text
          variant="titleMedium"
          style={[
            styles.title,
            {
              color: theme.colors.onSurface,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          {title}
        </Text>
      )}
      <View style={styles.content}>{children}</View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    padding: 16,
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
  },
});