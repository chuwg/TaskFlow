import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  mode?: 'flat' | 'outlined';
  left?: React.ReactNode;
  right?: React.ReactNode;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  secureTextEntry = false,
  error = false,
  helperText,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  mode = 'outlined',
  left,
  right,
  maxLength,
  autoCapitalize = 'none',
  keyboardType = 'default',
}) => {
  const { theme } = useTheme();

  return (
    <>
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
        mode={mode}
        left={left}
        right={right}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.sm,
          },
          style,
        ]}
        theme={{
          colors: {
            primary: theme.colors.primary,
            error: theme.colors.error,
            placeholder: theme.colors.onSurfaceVariant,
            background: theme.colors.surface,
          },
        }}
      />
      {helperText && (
        <HelperText type={error ? 'error' : 'info'} visible={!!helperText}>
          {helperText}
        </HelperText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
});