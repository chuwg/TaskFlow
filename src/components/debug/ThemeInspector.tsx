import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Surface, IconButton, Portal, Modal } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '../typography/Text';

interface ColorSampleProps {
  name: string;
  color: string;
}

const ColorSample: React.FC<ColorSampleProps> = ({ name, color }) => (
  <View style={styles.colorContainer}>
    <View style={[styles.colorSample, { backgroundColor: color }]} />
    <View style={styles.colorInfo}>
      <Text variant="bodySmall">{name}</Text>
      <Text variant="labelSmall" color="#666">
        {color}
      </Text>
    </View>
  </View>
);

export const ThemeInspector: React.FC = () => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  const toggleInspector = () => setVisible(!visible);

  const renderSection = (title: string, items: Record<string, any>) => (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </Text>
      {Object.entries(items).map(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('#')) {
          return <ColorSample key={key} name={key} color={value} />;
        }
        return (
          <View key={key} style={styles.item}>
            <Text variant="bodySmall">{key}</Text>
            <Text variant="labelSmall" color="#666">
              {JSON.stringify(value)}
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <>
      <IconButton
        icon="palette"
        size={24}
        onPress={toggleInspector}
        style={styles.trigger}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={toggleInspector}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.header}>
            <Text variant="titleLarge">테마 인스펙터</Text>
            <IconButton icon="close" size={24} onPress={toggleInspector} />
          </View>
          <ScrollView style={styles.content}>
            <Surface style={styles.container}>
              {renderSection('Colors', theme.colors)}
              {renderSection('Spacing', theme.spacing)}
              {renderSection('Font Sizes', theme.fontSizes)}
              {renderSection('Font Weights', theme.fontWeights)}
              {renderSection('Radii', theme.radii)}
            </Surface>
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modal: {
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorSample: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  colorInfo: {
    flex: 1,
  },
  item: {
    marginBottom: 8,
  },
});
