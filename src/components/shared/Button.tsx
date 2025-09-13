import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";

interface ButtonProps {
  mode?: "text" | "outlined" | "contained";
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  style?: object;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  mode = "contained",
  onPress,
  children,
  disabled = false,
  loading = false,
  color,
  style,
  icon,
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[styles.button, style]}
      contentStyle={styles.content}
      labelStyle={styles.label}
      textColor={color}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
  },
  content: {
    height: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
