import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage 타입 정의
interface AsyncStorageType {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

const storage = AsyncStorage as unknown as AsyncStorageType;
import type {
  CalendarEvent,
  CalendarViewMode,
  CalendarFilter,
  CalendarViewState,
} from '@/types/calendar';

interface CalendarState {
  events: CalendarEvent[];
  viewState: CalendarViewState;
  loading: boolean;
  error: string | null;
}

type CalendarAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EVENTS'; payload: CalendarEvent[] }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: { id: string; updates: Partial<CalendarEvent> } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: CalendarViewMode }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_SELECTED_DATE'; payload: Date | undefined }
  | { type: 'SET_FILTER'; payload: CalendarFilter | undefined };

const initialState: CalendarState = {
  events: [],
  viewState: {
    viewMode: 'month',
    currentDate: new Date(),
    selectedDate: undefined,
    filter: undefined,
  },
  loading: false,
  error: null,
};

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id
            ? { ...event, ...action.payload.updates }
            : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewState: { ...state.viewState, viewMode: action.payload },
      };
    case 'SET_CURRENT_DATE':
      return {
        ...state,
        viewState: { ...state.viewState, currentDate: action.payload },
      };
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        viewState: { ...state.viewState, selectedDate: action.payload },
      };
    case 'SET_FILTER':
      return {
        ...state,
        viewState: { ...state.viewState, filter: action.payload },
      };
    default:
      return state;
  }
};

interface CalendarContextType {
  state: CalendarState;
  // Event management
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEvent: (id: string) => CalendarEvent | undefined;
  // View management
  setViewMode: (mode: CalendarViewMode) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setFilter: (filter: CalendarFilter | undefined) => void;
  // Navigation
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;
  // Data queries
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForDateRange: (startDate: Date, endDate: Date) => CalendarEvent[];
  // Utility
  clearError: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const STORAGE_KEY = '@calendar_events';

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  // Load events from storage on mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Save events to storage whenever events change
  useEffect(() => {
    if (state.events.length > 0 || state.loading) return;
    saveEvents();
  }, [state.events]);

  const loadEvents = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedEvents = await storage.getItem(STORAGE_KEY);
      if (storedEvents) {
        const events = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: event.endDate ? new Date(event.endDate) : undefined,
          reminderTime: event.reminderTime ? new Date(event.reminderTime) : undefined,
        }));
        dispatch({ type: 'SET_EVENTS', payload: events });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '이벤트를 불러오는데 실패했습니다.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const saveEvents = useCallback(async () => {
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(state.events));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '이벤트를 저장하는데 실패했습니다.' });
    }
  }, [state.events]);

  const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      dispatch({ type: 'ADD_EVENT', payload: newEvent });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '이벤트를 추가하는데 실패했습니다.' });
    }
  }, []);

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      dispatch({ type: 'UPDATE_EVENT', payload: { id, updates } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '이벤트를 수정하는데 실패했습니다.' });
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'DELETE_EVENT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '이벤트를 삭제하는데 실패했습니다.' });
    }
  }, []);

  const getEvent = useCallback((id: string) => {
    return state.events.find((event) => event.id === id);
  }, [state.events]);

  const setViewMode = useCallback((mode: CalendarViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const setCurrentDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: date });
  }, []);

  const setSelectedDate = useCallback((date: Date | undefined) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  }, []);

  const setFilter = useCallback((filter: CalendarFilter | undefined) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const goToPrevious = useCallback(() => {
    const { viewMode, currentDate } = state.viewState;
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  }, [state.viewState]);

  const goToNext = useCallback(() => {
    const { viewMode, currentDate } = state.viewState;
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  }, [state.viewState]);

  const goToToday = useCallback(() => {
    const today = new Date();
    dispatch({ type: 'SET_CURRENT_DATE', payload: today });
    dispatch({ type: 'SET_SELECTED_DATE', payload: today });
  }, []);

  const getEventsForDate = useCallback((date: Date) => {
    const { filter } = state.viewState;
    let filteredEvents = state.events;

    // Apply filter if exists
    if (filter) {
      filteredEvents = filteredEvents.filter((event) => {
        if (filter.eventTypes && !filter.eventTypes.includes(event.type)) {
          return false;
        }
        if (filter.tags && event.tags && !filter.tags.some(tag => event.tags?.includes(tag))) {
          return false;
        }
        if (filter.startDate && event.startDate < filter.startDate) {
          return false;
        }
        if (filter.endDate && event.endDate && event.endDate > filter.endDate) {
          return false;
        }
        return true;
      });
    }

    // Filter by date
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return filteredEvents.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;

      return (
        (eventStart >= dayStart && eventStart <= dayEnd) ||
        (eventEnd >= dayStart && eventEnd <= dayEnd) ||
        (eventStart <= dayStart && eventEnd >= dayEnd)
      );
    });
  }, [state.events, state.viewState.filter]);

  const getEventsForDateRange = useCallback((startDate: Date, endDate: Date) => {
    const { filter } = state.viewState;
    let filteredEvents = state.events;

    // Apply filter if exists
    if (filter) {
      filteredEvents = filteredEvents.filter((event) => {
        if (filter.eventTypes && !filter.eventTypes.includes(event.type)) {
          return false;
        }
        if (filter.tags && event.tags && !filter.tags.some(tag => event.tags?.includes(tag))) {
          return false;
        }
        if (filter.startDate && event.startDate < filter.startDate) {
          return false;
        }
        if (filter.endDate && event.endDate && event.endDate > filter.endDate) {
          return false;
        }
        return true;
      });
    }

    return filteredEvents.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;

      return (
        (eventStart >= startDate && eventStart <= endDate) ||
        (eventEnd >= startDate && eventEnd <= endDate) ||
        (eventStart <= startDate && eventEnd >= endDate)
      );
    });
  }, [state.events, state.viewState.filter]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value: CalendarContextType = {
    state,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    setViewMode,
    setCurrentDate,
    setSelectedDate,
    setFilter,
    goToPrevious,
    goToNext,
    goToToday,
    getEventsForDate,
    getEventsForDateRange,
    clearError,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
};
