import React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useThemedAnimation } from '@/hooks/useThemedAnimation';
import { useTheme } from '@/hooks/useTheme';

interface AnimatedCardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  children,
  style,
  onPress,
}) => {
  const { theme } = useTheme();
  const { animatedColors, createSpringAnimation } = useThemedAnimation();

  const scaleAnimation = createSpringAnimation(1, {
    tension: 20,
    friction: 7,
  });

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnimation, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: animatedColors.background,
          borderColor: animatedColors.border,
          borderRadius: theme.radii.md,
          transform: [{ scale: scaleAnimation }],
        },
        style,
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {title && (
        <Animated.View
          style={[
            styles.titleContainer,
            {
              borderBottomColor: animatedColors.border,
            },
          ]}
        >
          <Text
            variant="titleMedium"
            style={{ color: animatedColors.text }}
          >
            {title}
          </Text>
        </Animated.View>
      )}
      <Animated.View style={styles.content}>{children}</Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
  },
  titleContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
  },
});
