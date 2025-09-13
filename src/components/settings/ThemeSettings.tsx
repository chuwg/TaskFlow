import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  List,
  Switch,
  RadioButton,
  Button,
  TextInput,
  Dialog,
  Portal,
  Text,
  Divider,
  Surface,
} from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { ColorPicker } from './ColorPicker.js';
import { ThemePresetPicker } from './ThemePresetPicker.js';
import type { ThemeMode } from '@/types/theme';

export const ThemeSettings = () => {
  const {
    theme,
    themeMode,
    isDarkMode,
    currentPreset,
    presets,
    setThemeMode,
    setPrimaryColor,
    createThemePreset,
    applyThemePreset,
    addThemePreset,
    removeThemePreset,
  } = useTheme();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetPrimaryColor, setNewPresetPrimaryColor] = useState(theme.colors.primary);
  const [newPresetSecondaryColor, setNewPresetSecondaryColor] = useState(theme.colors.secondary);

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleCreatePreset = () => {
    if (newPresetName.trim()) {
      const newPreset = createThemePreset(newPresetName, {
        primary: newPresetPrimaryColor,
        secondary: newPresetSecondaryColor,
      });
      addThemePreset(newPreset);
      setIsDialogVisible(false);
      setNewPresetName('');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.section}>
        <List.Section>
          <List.Subheader>테마 모드</List.Subheader>
          <RadioButton.Group
            onValueChange={(value) => handleThemeModeChange(value as ThemeMode)}
            value={themeMode}
          >
            <RadioButton.Item label="시스템 설정 사용" value="system" />
            <RadioButton.Item label="라이트 모드" value="light" />
            <RadioButton.Item label="다크 모드" value="dark" />
          </RadioButton.Group>
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>테마 색상</List.Subheader>
          <ColorPicker
            selectedColor={theme.colors.primary}
            onSelectColor={setPrimaryColor}
            label="주 색상"
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>테마 프리셋</List.Subheader>
          <ThemePresetPicker
            presets={presets}
            selectedPresetId={currentPreset?.id || null}
            onSelectPreset={applyThemePreset}
            onDeletePreset={removeThemePreset}
          />
          <Button
            mode="outlined"
            onPress={() => setIsDialogVisible(true)}
            style={styles.addButton}
          >
            새 프리셋 추가
          </Button>
        </List.Section>
      </Surface>

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>새 테마 프리셋 만들기</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="프리셋 이름"
              value={newPresetName}
              onChangeText={setNewPresetName}
              style={styles.input}
            />
            <ColorPicker
              selectedColor={newPresetPrimaryColor}
              onSelectColor={setNewPresetPrimaryColor}
              label="주 색상"
            />
            <ColorPicker
              selectedColor={newPresetSecondaryColor}
              onSelectColor={setNewPresetSecondaryColor}
              label="보조 색상"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>취소</Button>
            <Button onPress={handleCreatePreset}>생성</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    padding: 16,
  },
  divider: {
    marginVertical: 16,
  },
  addButton: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
});