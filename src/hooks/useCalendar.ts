import { useState, useCallback } from 'react';
import type {
  CalendarEvent,
  CalendarViewMode,
  CalendarFilter,
} from '@/types/calendar';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  addMonths,
  generateMonthInfo,
} from '@/utils/calendar';

export const useCalendar = () => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filter, setFilter] = useState<CalendarFilter>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const filterEvents = useCallback(
    (eventsToFilter: CalendarEvent[]) => {
      if (!filter) return eventsToFilter;

      return eventsToFilter.filter((event) => {
        // 이벤트 타입 필터
        if (
          filter.eventTypes &&
          filter.eventTypes.length > 0 &&
          !filter.eventTypes.includes(event.type)
        ) {
          return false;
        }

        // 태그 필터
        if (
          filter.tags &&
          filter.tags.length > 0 &&
          (!event.tags || !filter.tags.some((tag) => event.tags?.includes(tag)))
        ) {
          return false;
        }

        // 날짜 범위 필터
        if (filter.startDate && event.startDate < filter.startDate) {
          return false;
        }
        if (filter.endDate && event.endDate && event.endDate > filter.endDate) {
          return false;
        }

        return true;
      });
    },
    [filter]
  );

  const getEventsForDate = useCallback(
    (date: Date) => {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      return filterEvents(events).filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;

        return (
          (eventStart >= dayStart && eventStart <= dayEnd) ||
          (eventEnd >= dayStart && eventEnd <= dayEnd) ||
          (eventStart <= dayStart && eventEnd >= dayEnd)
        );
      });
    },
    [events, filterEvents]
  );

  const addEvent = useCallback(
    (event: CalendarEvent) => {
      setEvents((prev) => [...prev, event]);
    },
    []
  );

  const updateEvent = useCallback(
    (eventId: string, updates: Partial<CalendarEvent>) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, ...updates } : event
        )
      );
    },
    []
  );

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  }, []);

  const navigateToDate = useCallback((date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
  }, []);

  const monthInfo = generateMonthInfo(
    currentDate,
    filterEvents(events),
    selectedDate
  );

  return {
    viewMode,
    currentDate,
    selectedDate,
    filter,
    events: filterEvents(events),
    monthInfo,
    setViewMode,
    setCurrentDate,
    setSelectedDate,
    setFilter,
    getEventsForDate,
    addEvent,
    updateEvent,
    deleteEvent,
    navigateToDate,
  };
};
