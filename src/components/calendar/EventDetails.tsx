import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import { Text } from '../typography/Text';
import { Card } from '../shared/Card';
import type { CalendarEvent } from '@/types/calendar';

interface EventDetailsProps {
  event: CalendarEvent;
  onEdit?: () => void;
  onDelete?: () => void;
  onNavigateToSource?: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onEdit,
  onDelete,
  onNavigateToSource,
}) => {
  const { theme } = useTheme();
  const { getEventReference } = useCalendarIntegration();

  const reference = getEventReference(event);

  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'task':
        return '할 일';
      case 'expense':
        return '가계부';
      case 'note':
        return '노트';
      default:
        return '일정';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View
          style={[
            styles.typeIndicator,
            { backgroundColor: event.color || theme.colors.primary },
          ]}
        />
        <Text variant="titleMedium">{getEventTypeLabel()}</Text>
        <View style={styles.actions}>
          {reference && (
            <IconButton
              icon="link"
              size={20}
              onPress={onNavigateToSource}
            />
          )}
          <IconButton
            icon="pencil"
            size={20}
            onPress={onEdit}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={onDelete}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text variant="headlineSmall">{event.title}</Text>
        {event.description && (
          <Text
            variant="bodyMedium"
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {event.description}
          </Text>
        )}

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text variant="bodyMedium">시작</Text>
            <Text variant="bodyMedium">{formatDateTime(event.startDate)}</Text>
          </View>
          {event.endDate && (
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">종료</Text>
              <Text variant="bodyMedium">{formatDateTime(event.endDate)}</Text>
            </View>
          )}
          {event.location && (
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">장소</Text>
              <Text variant="bodyMedium">{event.location}</Text>
            </View>
          )}
        </View>

        {event.tags && event.tags.length > 0 && (
          <View style={styles.tags}>
            {event.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
              >
                <Text
                  variant="labelMedium"
                  style={{ color: theme.colors.onPrimaryContainer }}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {reference && (
          <View
            style={[
              styles.referenceInfo,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Text variant="bodySmall">
              이 일정은 {getEventTypeLabel()}에서 연동되었습니다.
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  content: {
    padding: 16,
  },
  description: {
    marginTop: 8,
  },
  details: {
    marginTop: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  referenceInfo: {
    marginTop: 16,
    padding: 8,
    borderRadius: 4,
  },
});
