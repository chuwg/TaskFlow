import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, TouchableRipple, IconButton } from 'react-native-paper';
import type { ThemePreset } from '@/types/theme';
import { useTheme } from '@/hooks/useTheme';

interface ThemePresetPickerProps {
  presets: ThemePreset[];
  selectedPresetId: string | null;
  onSelectPreset: (preset: ThemePreset) => void;
  onDeletePreset?: (presetId: string) => void;
}

export const ThemePresetPicker: React.FC<ThemePresetPickerProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  onDeletePreset,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {presets.map((preset) => (
        <Card
          key={preset.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: selectedPresetId === preset.id ? theme.colors.primary : theme.colors.border,
            },
          ]}
        >
          <TouchableRipple onPress={() => onSelectPreset(preset)}>
            <View style={styles.cardContent}>
              <View style={styles.presetInfo}>
                <Text variant="titleMedium">{preset.name}</Text>
                <View style={styles.colorPreview}>
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: preset.colors.primary },
                    ]}
                  />
                  {preset.colors.secondary && (
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: preset.colors.secondary },
                      ]}
                    />
                  )}
                </View>
              </View>
              {onDeletePreset && preset.id !== 'default' && (
                <IconButton
                  icon="delete-outline"
                  size={20}
                  onPress={() => onDeletePreset(preset.id)}
                />
              )}
            </View>
          </TouchableRipple>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  card: {
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  presetInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 8,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
