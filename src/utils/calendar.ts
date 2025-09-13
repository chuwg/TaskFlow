import type {
  CalendarDayInfo,
  CalendarWeekInfo,
  CalendarMonthInfo,
  CalendarEvent,
} from '@/types/calendar';

export const DAYS_IN_WEEK = 7;
export const WEEKS_IN_MONTH = 6;

export const getDayName = (date: Date, format: 'long' | 'short' = 'short'): string => {
  return date.toLocaleDateString('ko-KR', { weekday: format });
};

export const getMonthName = (date: Date, format: 'long' | 'short' = 'long'): string => {
  return date.toLocaleDateString('ko-KR', { month: format });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  return startOfDay(result);
};

export const startOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  return startOfDay(result);
};

export const endOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return endOfDay(result);
};

export const getWeekNumber = (date: Date): number => {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

export const getEventsForDay = (
  events: CalendarEvent[],
  date: Date
): CalendarEvent[] => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return events.filter((event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;

    return (
      (eventStart >= dayStart && eventStart <= dayEnd) ||
      (eventEnd >= dayStart && eventEnd <= dayEnd) ||
      (eventStart <= dayStart && eventEnd >= dayEnd)
    );
  });
};

export const generateDayInfo = (
  date: Date,
  events: CalendarEvent[],
  selectedDate?: Date,
  currentMonth?: Date
): CalendarDayInfo => {
  const today = new Date();
  const dayEvents = getEventsForDay(events, date);

  return {
    date,
    events: dayEvents,
    isToday: isSameDay(date, today),
    isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
    isCurrentMonth: currentMonth ? isSameMonth(date, currentMonth) : true,
    dayNumber: date.getDate(),
    dayName: getDayName(date),
  };
};

export const generateWeekInfo = (
  startDate: Date,
  events: CalendarEvent[],
  selectedDate?: Date,
  currentMonth?: Date
): CalendarWeekInfo => {
  const days: CalendarDayInfo[] = [];
  const weekEvents: CalendarEvent[] = [];
  const weekNumber = getWeekNumber(startDate);

  for (let i = 0; i < DAYS_IN_WEEK; i++) {
    const date = addDays(startDate, i);
    const dayInfo = generateDayInfo(date, events, selectedDate, currentMonth);
    days.push(dayInfo);
    weekEvents.push(...dayInfo.events);
  }

  return {
    weekNumber,
    days,
    events: weekEvents,
  };
};

export const generateMonthInfo = (
  date: Date,
  events: CalendarEvent[],
  selectedDate?: Date
): CalendarMonthInfo => {
  const firstDay = startOfMonth(date);
  const startDate = startOfWeek(firstDay);
  const weeks: CalendarWeekInfo[] = [];
  const monthEvents: CalendarEvent[] = [];

  for (let i = 0; i < WEEKS_IN_MONTH; i++) {
    const weekStart = addDays(startDate, i * DAYS_IN_WEEK);
    const weekInfo = generateWeekInfo(weekStart, events, selectedDate, date);
    weeks.push(weekInfo);
    monthEvents.push(...weekInfo.events);
  }

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    weeks,
    events: monthEvents,
  };
};
