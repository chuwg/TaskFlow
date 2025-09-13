import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { ThemePresetList } from '@/components/settings/ThemePresetList';
import { ThemeInspector } from '@/components/debug/ThemeInspector';
import { Card } from '@/components/shared/Card';
import { Text } from '@/components/typography/Text';
import { themePresets, darkThemePresets } from '@/constants/themePresets';

export const SettingsScreen = () => {
  const { theme, isDarkMode, currentPreset, setThemePreset } = useTheme();

  const availablePresets = [...themePresets, ...darkThemePresets];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={styles.section}>
        <Text variant="headlineMedium" style={styles.title}>
          앱 설정
        </Text>

        <List.Section>
          <List.Subheader>테마 설정</List.Subheader>
          <ThemeSettings />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>테마 프리셋</List.Subheader>
          <ThemePresetList
            presets={availablePresets}
            selectedPresetId={currentPreset?.id || 'default'}
            onSelectPreset={setThemePreset}
          />
        </List.Section>

        {__DEV__ && (
          <>
            <Divider style={styles.divider} />
            <List.Section>
              <List.Subheader>개발자 도구</List.Subheader>
              <ThemeInspector />
            </List.Section>
          </>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    margin: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 16,
  },
});