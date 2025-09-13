// 공통 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
}

// 캘린더 관련 타입
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  type: 'task' | 'expense' | 'note';
  tags: string[];
}

// 할일 관련 타입
export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

// 가계부 관련 타입
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date;
  description: string;
  tags: string[];
}

// 노트 관련 타입
export interface Note {
  id: string;
  title: string;
  content: string;
  created: Date;
  modified: Date;
  tags: string[];
}
