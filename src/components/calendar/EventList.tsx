import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '../typography/Text';
import { ListItem } from '../shared/ListItem';
import type { CalendarEvent } from '@/types/calendar';

interface EventListProps {
  events: CalendarEvent[];
  onEventPress?: (event: CalendarEvent) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onEventPress,
}) => {
  const { theme } = useTheme();

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'task':
        return 'checkbox-marked-outline';
      case 'expense':
        return 'currency-usd';
      case 'note':
        return 'note-text-outline';
      default:
        return 'calendar';
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.color) return event.color;

    switch (event.type) {
      case 'task':
        return theme.colors.primary;
      case 'expense':
        return theme.colors.error;
      case 'note':
        return theme.colors.info;
      default:
        return theme.colors.secondary;
    }
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (event.allDay) return '종일';

    const startTime = event.startDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    if (!event.endDate) return startTime;

    const endTime = event.endDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${startTime} - ${endTime}`;
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    return a.startDate.getTime() - b.startDate.getTime();
  });

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          일정이 없습니다
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {sortedEvents.map((event) => (
        <ListItem
          key={event.id}
          title={event.title}
          description={event.description}
          left={() => (
            <View
              style={[
                styles.eventIndicator,
                { backgroundColor: getEventColor(event) },
              ]}
            />
          )}
          right={() => (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {formatEventTime(event)}
            </Text>
          )}
          onPress={() => onEventPress?.(event)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  eventIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
