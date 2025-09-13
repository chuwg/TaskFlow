import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '../typography/Text';
import type { CalendarViewMode } from '@/types/calendar';
import { getMonthName } from '@/utils/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onViewModeChange,
}) => {
  const { theme } = useTheme();

  const getHeaderTitle = () => {
    const year = currentDate.getFullYear();
    const month = getMonthName(currentDate);

    switch (viewMode) {
      case 'month':
        return `${year}년 ${month}`;
      case 'week':
        return `${year}년 ${month} (주간)`;
      case 'day':
        return `${year}년 ${month} ${currentDate.getDate()}일`;
      case 'agenda':
        return '일정 목록';
      default:
        return '';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.titleContainer}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={onPrevious}
        />
        <Text variant="titleLarge" style={styles.title}>
          {getHeaderTitle()}
        </Text>
        <IconButton
          icon="chevron-right"
          size={24}
          onPress={onNext}
        />
      </View>

      <View style={styles.viewModeContainer}>
        <IconButton
          icon="calendar-month"
          size={20}
          selected={viewMode === 'month'}
          onPress={() => onViewModeChange('month')}
        />
        <IconButton
          icon="calendar-week"
          size={20}
          selected={viewMode === 'week'}
          onPress={() => onViewModeChange('week')}
        />
        <IconButton
          icon="calendar-today"
          size={20}
          selected={viewMode === 'day'}
          onPress={() => onViewModeChange('day')}
        />
        <IconButton
          icon="format-list-bulleted"
          size={20}
          selected={viewMode === 'agenda'}
          onPress={() => onViewModeChange('agenda')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
});
