import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableRipple, Text } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';

interface ListItemProps {
  title: string;
  description?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  left,
  right,
  onPress,
  style,
  disabled = false,
}) => {
  const { theme } = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      {left && <View style={styles.left}>{left}</View>}
      <View style={styles.content}>
        <Text
          variant="bodyLarge"
          style={{ color: disabled ? theme.colors.onSurfaceVariant : theme.colors.onSurface }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {description && (
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
      </View>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableRipple onPress={onPress}>
        {content}
      </TouchableRipple>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  left: {
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    marginLeft: 16,
  },
});
