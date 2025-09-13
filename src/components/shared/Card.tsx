import React from "react";
import { StyleSheet } from "react-native";
import { Card as PaperCard } from "react-native-paper";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
  contentStyle?: object;
  mode?: "elevated" | "outlined";
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  style,
  contentStyle,
  mode = "elevated",
  elevation = 1,
}) => {
  return (
    <PaperCard
      mode={mode}
      onPress={onPress}
      style={[styles.card, style]}
      contentStyle={[styles.content, contentStyle]}
      elevation={elevation}
    >
      {title && (
        <PaperCard.Title
          title={title}
          subtitle={subtitle}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
        />
      )}
      <PaperCard.Content>{children}</PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
