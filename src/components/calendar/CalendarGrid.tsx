import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '../typography/Text';
import type { CalendarDayInfo, CalendarMonthInfo } from '@/types/calendar';
import { DAYS_IN_WEEK } from '@/utils/calendar';

interface CalendarGridProps {
  monthInfo: CalendarMonthInfo;
  onSelectDate: (date: Date) => void;
}

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthInfo,
  onSelectDate,
}) => {
  const { theme } = useTheme();

  const renderWeekdayHeader = () => (
    <View style={styles.weekdayHeader}>
      {WEEKDAY_NAMES.map((name, index) => (
        <View
          key={index}
          style={[
            styles.weekdayCell,
            {
              backgroundColor: theme.colors.surface,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <Text
            variant="bodyMedium"
            style={{
              color:
                index === 0
                  ? theme.colors.error
                  : index === 6
                  ? theme.colors.primary
                  : theme.colors.onSurface,
            }}
          >
            {name}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderDayCell = (dayInfo: CalendarDayInfo) => {
    const isWeekend = dayInfo.date.getDay() === 0 || dayInfo.date.getDay() === 6;
    const textColor = isWeekend
      ? dayInfo.date.getDay() === 0
        ? theme.colors.error
        : theme.colors.primary
      : dayInfo.isCurrentMonth
      ? theme.colors.onSurface
      : theme.colors.onSurfaceVariant;

    return (
      <View
        key={dayInfo.date.toISOString()}
        style={[
          styles.dayCell,
          {
            backgroundColor: dayInfo.isSelected
              ? theme.colors.primaryContainer
              : dayInfo.isToday
              ? theme.colors.surfaceVariant
              : theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onTouchEnd={() => onSelectDate(dayInfo.date)}
      >
        <Text
          variant="bodyMedium"
          style={[
            styles.dayNumber,
            {
              color: textColor,
              fontWeight: dayInfo.isToday ? 'bold' : 'normal',
            },
          ]}
        >
          {dayInfo.dayNumber}
        </Text>
        {dayInfo.events.length > 0 && (
          <View style={styles.eventIndicatorContainer}>
            {dayInfo.events.slice(0, 3).map((event, index) => (
              <View
                key={index}
                style={[
                  styles.eventIndicator,
                  {
                    backgroundColor: event.color || theme.colors.primary,
                  },
                ]}
              />
            ))}
            {dayInfo.events.length > 3 && (
              <Text variant="labelSmall" style={styles.moreEvents}>
                +{dayInfo.events.length - 3}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderWeekdayHeader()}
      {monthInfo.weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.days.map((day) => renderDayCell(day))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekdayHeader: {
    flexDirection: 'row',
    height: 40,
  },
  weekdayCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  week: {
    flex: 1,
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    padding: 4,
    borderWidth: 0.5,
  },
  dayNumber: {
    textAlign: 'center',
  },
  eventIndicatorContainer: {
    marginTop: 4,
    alignItems: 'center',
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginVertical: 1,
  },
  moreEvents: {
    marginTop: 2,
    textAlign: 'center',
  },
});
