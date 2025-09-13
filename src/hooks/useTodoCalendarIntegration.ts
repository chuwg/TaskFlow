import { useCallback } from 'react';
import { useTodoContext } from '@/contexts/TodoContext';
import { useCalendarContext } from '@/contexts/CalendarContext';
import type { Todo, CalendarEvent } from '@/types';

export const useTodoCalendarIntegration = () => {
  const { addEvent, updateEvent, deleteEvent } = useCalendarContext();
  const { addTodo, updateTodo, deleteTodo } = useTodoContext();

  // 할일을 캘린더 이벤트로 변환
  const todoToCalendarEvent = useCallback((todo: Todo): Omit<CalendarEvent, 'id'> => {
    return {
      title: todo.title,
      description: todo.description || '',
      startDate: todo.dueDate || new Date(),
      endDate: todo.dueDate ? new Date(todo.dueDate.getTime() + 60 * 60 * 1000) : undefined, // 1시간 후
      type: 'task',
      allDay: !todo.dueDate || (todo.dueDate.getHours() === 0 && todo.dueDate.getMinutes() === 0),
      color: getTodoColor(todo),
      tags: todo.tags,
      location: todo.location,
      reminder: true,
      reminderTime: todo.dueDate,
      todoRef: todo,
    };
  }, []);

  // 할일 색상 결정
  const getTodoColor = useCallback((todo: Todo): string => {
    switch (todo.priority) {
      case 'urgent':
        return '#F44336'; // 빨간색
      case 'high':
        return '#FF9800'; // 주황색
      case 'medium':
        return '#2196F3'; // 파란색
      case 'low':
        return '#4CAF50'; // 초록색
      default:
        return '#9E9E9E'; // 회색
    }
  }, []);

  // 할일을 캘린더에 추가
  const addTodoToCalendar = useCallback(async (todo: Todo) => {
    if (!todo.dueDate) return;

    try {
      const eventData = todoToCalendarEvent(todo);
      await addEvent(eventData);
    } catch (error) {
      console.error('Failed to add todo to calendar:', error);
    }
  }, [addEvent, todoToCalendarEvent]);

  // 할일을 캘린더에서 업데이트
  const updateTodoInCalendar = useCallback(async (todo: Todo, eventId?: string) => {
    if (!todo.dueDate || !eventId) return;

    try {
      const eventData = todoToCalendarEvent(todo);
      await updateEvent(eventId, eventData);
    } catch (error) {
      console.error('Failed to update todo in calendar:', error);
    }
  }, [updateEvent, todoToCalendarEvent]);

  // 할일을 캘린더에서 삭제
  const removeTodoFromCalendar = useCallback(async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Failed to remove todo from calendar:', error);
    }
  }, [deleteEvent]);

  // 캘린더 이벤트에서 할일 생성
  const createTodoFromEvent = useCallback(async (event: CalendarEvent) => {
    if (event.type !== 'task') return;

    try {
      const todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> = {
        title: event.title,
        description: event.description || '',
        status: 'pending',
        priority: 'medium',
        category: 'other',
        dueDate: event.startDate,
        tags: event.tags || [],
        location: event.location,
        color: event.color,
      };

      await addTodo(todoData);
    } catch (error) {
      console.error('Failed to create todo from event:', error);
    }
  }, [addTodo]);

  // 할일 상태에 따른 캘린더 이벤트 색상 업데이트
  const updateCalendarEventColor = useCallback(async (todo: Todo, eventId?: string) => {
    if (!eventId) return;

    try {
      const color = getTodoColor(todo);
      await updateEvent(eventId, { color });
    } catch (error) {
      console.error('Failed to update calendar event color:', error);
    }
  }, [updateEvent, getTodoColor]);

  return {
    todoToCalendarEvent,
    addTodoToCalendar,
    updateTodoInCalendar,
    removeTodoFromCalendar,
    createTodoFromEvent,
    updateCalendarEventColor,
    getTodoColor,
  };
};
