import { useCallback } from 'react';
import type { CalendarEvent } from '@/types/calendar';
import type { Todo } from '@/types/todo';
import type { Transaction } from '@/types/finance';
import type { Note } from '@/types/note';
import { useCalendar } from './useCalendar';

export const useCalendarIntegration = () => {
  const {
    addEvent,
    updateEvent,
    deleteEvent,
    events,
  } = useCalendar();

  // Todo 항목을 캘린더 이벤트로 변환
  const convertTodoToEvent = useCallback((todo: Todo): CalendarEvent => {
    return {
      id: `todo-${todo.id}`,
      title: todo.title,
      description: todo.description,
      startDate: todo.dueDate || new Date(),
      type: 'task',
      color: todo.priority === 'high' ? '#f44336' : 
             todo.priority === 'medium' ? '#ff9800' : '#4caf50',
      tags: todo.tags,
      todoRef: todo,
    };
  }, []);

  // 거래 내역을 캘린더 이벤트로 변환
  const convertTransactionToEvent = useCallback((transaction: Transaction): CalendarEvent => {
    return {
      id: `transaction-${transaction.id}`,
      title: `${transaction.type === 'income' ? '수입' : '지출'}: ${transaction.amount.toLocaleString()}원`,
      description: transaction.description,
      startDate: transaction.date,
      type: 'expense',
      color: transaction.type === 'income' ? '#4caf50' : '#f44336',
      tags: transaction.tags,
      transactionRef: transaction,
    };
  }, []);

  // 노트를 캘린더 이벤트로 변환
  const convertNoteToEvent = useCallback((note: Note): CalendarEvent => {
    return {
      id: `note-${note.id}`,
      title: note.title,
      description: note.content,
      startDate: note.created,
      type: 'note',
      color: '#2196f3',
      tags: note.tags,
      noteRef: note,
    };
  }, []);

  // Todo 항목 연동
  const syncTodo = useCallback((todo: Todo) => {
    const existingEvent = events.find((event) => event.id === `todo-${todo.id}`);
    const newEvent = convertTodoToEvent(todo);

    if (existingEvent) {
      updateEvent(existingEvent.id, newEvent);
    } else {
      addEvent(newEvent);
    }
  }, [events, addEvent, updateEvent, convertTodoToEvent]);

  const removeTodo = useCallback((todoId: string) => {
    deleteEvent(`todo-${todoId}`);
  }, [deleteEvent]);

  // 거래 내역 연동
  const syncTransaction = useCallback((transaction: Transaction) => {
    const existingEvent = events.find((event) => event.id === `transaction-${transaction.id}`);
    const newEvent = convertTransactionToEvent(transaction);

    if (existingEvent) {
      updateEvent(existingEvent.id, newEvent);
    } else {
      addEvent(newEvent);
    }
  }, [events, addEvent, updateEvent, convertTransactionToEvent]);

  const removeTransaction = useCallback((transactionId: string) => {
    deleteEvent(`transaction-${transactionId}`);
  }, [deleteEvent]);

  // 노트 연동
  const syncNote = useCallback((note: Note) => {
    const existingEvent = events.find((event) => event.id === `note-${note.id}`);
    const newEvent = convertNoteToEvent(note);

    if (existingEvent) {
      updateEvent(existingEvent.id, newEvent);
    } else {
      addEvent(newEvent);
    }
  }, [events, addEvent, updateEvent, convertNoteToEvent]);

  const removeNote = useCallback((noteId: string) => {
    deleteEvent(`note-${noteId}`);
  }, [deleteEvent]);

  // 이벤트에서 원본 항목 참조 가져오기
  const getEventReference = useCallback((event: CalendarEvent) => {
    if (event.todoRef) return { type: 'todo' as const, item: event.todoRef };
    if (event.transactionRef) return { type: 'transaction' as const, item: event.transactionRef };
    if (event.noteRef) return { type: 'note' as const, item: event.noteRef };
    return null;
  }, []);

  return {
    syncTodo,
    removeTodo,
    syncTransaction,
    removeTransaction,
    syncNote,
    removeNote,
    getEventReference,
  };
};
