import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/colors';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  label?: string;
}

const COLORS = [
  { name: '보라색', value: palette.purple.main },
  { name: '파란색', value: palette.blue.main },
  { name: '초록색', value: palette.green.main },
  { name: '주황색', value: palette.orange.main },
  { name: '빨간색', value: palette.red.main },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.colorsContainer}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color.value}
            onPress={() => onSelectColor(color.value)}
            style={styles.colorButton}
          >
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: color.value },
                selectedColor === color.value && styles.selectedColor,
              ]}
            />
            <Text style={styles.colorName}>{color.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    alignItems: 'center',
    width: 60,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000',
  },
  colorName: {
    fontSize: 12,
  },
});
