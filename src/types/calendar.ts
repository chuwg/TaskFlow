import type { Todo } from './todo';
import type { Transaction } from './finance';
import type { Note } from './note';

export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

export type CalendarEventType = 'task' | 'expense' | 'note' | 'custom';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
  type: CalendarEventType;
  color?: string;
  location?: string;
  reminder?: boolean;
  reminderTime?: Date;
  recurrence?: CalendarRecurrence;
  tags?: string[];
  
  // 연동된 항목 참조
  todoRef?: Todo;
  transactionRef?: Transaction;
  noteRef?: Note;
}

export interface CalendarRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number; // 반복 간격 (예: 2주마다 = 2)
  endDate?: Date; // 반복 종료일
  endOccurrences?: number; // 반복 횟수
  daysOfWeek?: number[]; // 요일 (0 = 일요일, 6 = 토요일)
  daysOfMonth?: number[]; // 날짜 (1-31)
  monthsOfYear?: number[]; // 월 (1-12)
}

export interface CalendarFilter {
  eventTypes?: CalendarEventType[];
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface CalendarViewState {
  viewMode: CalendarViewMode;
  currentDate: Date;
  selectedDate?: Date;
  filter?: CalendarFilter;
}

export interface CalendarDayInfo {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  dayNumber: number;
  dayName: string;
}

export interface CalendarWeekInfo {
  weekNumber: number;
  days: CalendarDayInfo[];
  events: CalendarEvent[];
}

export interface CalendarMonthInfo {
  year: number;
  month: number;
  weeks: CalendarWeekInfo[];
  events: CalendarEvent[];
}
