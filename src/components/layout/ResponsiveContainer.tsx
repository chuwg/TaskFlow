import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsiveTheme } from '@/hooks/useResponsiveTheme';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  defaultColumns?: number;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  defaultColumns = 1,
  style,
  contentContainerStyle,
}) => {
  const { theme, getResponsiveLayout } = useResponsiveTheme();
  const { columns, gap, isPortrait } = getResponsiveLayout(defaultColumns);

  const childrenArray = React.Children.toArray(children);
  const rows = Math.ceil(childrenArray.length / columns);

  return (
    <View
      style={[
        styles.container,
        {
          padding: theme.spacing.md,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.grid,
          {
            gap: gap,
          },
          contentContainerStyle,
        ]}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.row,
              {
                gap: gap,
              },
            ]}
          >
            {childrenArray
              .slice(rowIndex * columns, (rowIndex + 1) * columns)
              .map((child, index) => (
                <View
                  key={index}
                  style={[
                    styles.column,
                    {
                      flex: 1 / columns,
                    },
                  ]}
                >
                  {child}
                </View>
              ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
});
