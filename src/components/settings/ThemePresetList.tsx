import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Surface, TouchableRipple } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '../typography/Text.js';
import type { ThemePreset } from '@/types/theme';

interface ThemePresetListProps {
  presets: ThemePreset[];
  selectedPresetId: string;
  onSelectPreset: (preset: ThemePreset) => void;
}

export const ThemePresetList: React.FC<ThemePresetListProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
}) => {
  const { theme } = useTheme();

  const renderPresetPreview = (preset: ThemePreset) => (
    <View style={styles.previewContainer}>
      {/* 헤더 미리보기 */}
      <View
        style={[
          styles.previewHeader,
          { backgroundColor: preset.colors.primary },
        ]}
      />
      {/* 컨텐츠 미리보기 */}
      <View
        style={[
          styles.previewContent,
          { backgroundColor: preset.colors.surface || theme.colors.surface },
        ]}
      >
        <View
          style={[
            styles.previewButton,
            { backgroundColor: preset.colors.secondary },
          ]}
        />
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor: preset.colors.card || theme.colors.card,
              borderColor: preset.colors.border || theme.colors.border,
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {presets.map((preset) => (
        <TouchableRipple
          key={preset.id}
          onPress={() => onSelectPreset(preset)}
          style={styles.presetItem}
        >
          <Surface
            style={[
              styles.presetCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor:
                  selectedPresetId === preset.id
                    ? theme.colors.primary
                    : theme.colors.border,
              },
            ]}
          >
            {renderPresetPreview(preset)}
            <Text
              variant="titleMedium"
              style={[styles.presetName, { color: theme.colors.onSurface }]}
            >
              {preset.name}
            </Text>
          </Surface>
        </TouchableRipple>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  presetItem: {
    width: '47%',
    marginBottom: 16,
  },
  presetCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  previewContainer: {
    height: 120,
  },
  previewHeader: {
    height: 40,
  },
  previewContent: {
    flex: 1,
    padding: 8,
  },
  previewButton: {
    width: 60,
    height: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  previewCard: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetName: {
    padding: 12,
    textAlign: 'center',
  },
});
