import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import type { CalendarViewMode, CalendarEvent } from '@/types/calendar';
import {
  generateMonthInfo,
  addMonths,
  isSameDay,
} from '@/utils/calendar';

interface CalendarProps {
  events: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
  onEventPress?: (event: CalendarEvent) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  onSelectDate,
  onEventPress,
}) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();

  const monthInfo = generateMonthInfo(currentDate, events, selectedDate);

  const handlePrevious = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, -1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      onSelectDate?.(date);
    },
    [onSelectDate]
  );

  const handleViewModeChange = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewModeChange={handleViewModeChange}
      />
      <CalendarGrid
        monthInfo={monthInfo}
        onSelectDate={handleDateSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
