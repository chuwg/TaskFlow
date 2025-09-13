import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
  mode?: "flat" | "outlined";
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  secureTextEntry = false,
  error = false,
  errorText,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  mode = "outlined",
  left,
  right,
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      label={label}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      error={error}
      disabled={disabled}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[styles.input, style]}
      mode={mode}
      left={left}
      right={right}
      theme={{
        colors: {
          primary: "#6200ee",
          error: "#B00020",
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    backgroundColor: "transparent",
  },
});
