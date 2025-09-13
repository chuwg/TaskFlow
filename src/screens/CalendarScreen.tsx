import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, FAB, Dialog } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { useCalendar } from '@/hooks/useCalendar';
import { Calendar } from '@/components/calendar/Calendar';
import { EventList } from '@/components/calendar/EventList';
import { EventForm } from '@/components/calendar/EventForm';
import { EventDetails } from '@/components/calendar/EventDetails';
import type { CalendarEvent } from '@/types/calendar';

export const CalendarScreen = () => {
  const { theme } = useTheme();
  const {
    events,
    currentDate,
    selectedDate,
    addEvent,
    updateEvent,
    deleteEvent,
    navigateToDate,
  } = useCalendar();

  const [isAddEventVisible, setIsAddEventVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailsVisible, setIsEventDetailsVisible] = useState(false);

  const handleAddEvent = (eventData: Partial<CalendarEvent>) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventData.title || '',
      description: eventData.description || '',
      startDate: eventData.startDate || new Date(),
      endDate: eventData.endDate,
      type: eventData.type || 'custom',
      location: eventData.location,
      allDay: eventData.allDay || false,
      color: theme.colors.primary,
    };

    addEvent(newEvent);
    setIsAddEventVisible(false);
  };

  const handleEventPress = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsVisible(true);
  };

  const handleEditEvent = () => {
    setIsEventDetailsVisible(false);
    setIsAddEventVisible(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setSelectedEvent(null);
      setIsEventDetailsVisible(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Calendar
        events={events}
        onSelectDate={navigateToDate}
        onEventPress={handleEventPress}
      />

      <EventList
        events={events.filter(
          (event) =>
            event.startDate.toDateString() === selectedDate?.toDateString()
        )}
        onEventPress={handleEventPress}
      />

      <Portal>
        {/* 이벤트 추가/수정 다이얼로그 */}
        <Dialog
          visible={isAddEventVisible}
          onDismiss={() => setIsAddEventVisible(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <EventForm
            event={selectedEvent || undefined}
            onSubmit={handleAddEvent}
            onCancel={() => {
              setIsAddEventVisible(false);
              setSelectedEvent(null);
            }}
          />
        </Dialog>

        {/* 이벤트 상세 정보 다이얼로그 */}
        <Dialog
          visible={isEventDetailsVisible}
          onDismiss={() => setIsEventDetailsVisible(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onNavigateToSource={() => {
                // TODO: 연동된 항목으로 이동하는 기능 구현
                setIsEventDetailsVisible(false);
              }}
            />
          )}
        </Dialog>

        {/* 이벤트 추가 버튼 */}
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            setSelectedEvent(null);
            setIsAddEventVisible(true);
          }}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
