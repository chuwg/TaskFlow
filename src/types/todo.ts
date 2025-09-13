// 할일 관리 관련 타입 정의

export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoCategory = 'work' | 'personal' | 'health' | 'shopping' | 'study' | 'other';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  category: TodoCategory;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  subtasks?: TodoSubtask[];
  parentId?: string; // 상위 할일 ID (하위 할일인 경우)
  estimatedTime?: number; // 예상 소요 시간 (분)
  actualTime?: number; // 실제 소요 시간 (분)
  location?: string;
  reminder?: TodoReminder;
  isRecurring?: boolean;
  recurrence?: TodoRecurrence;
  attachments?: TodoAttachment[];
  notes?: string;
  color?: string;
}

export interface TodoSubtask {
  id: string;
  title: string;
  status: TodoStatus;
  completedAt?: Date;
  createdAt: Date;
}

export interface TodoReminder {
  enabled: boolean;
  time: Date;
  type: 'notification' | 'email' | 'both';
  repeat?: 'once' | 'daily' | 'weekly' | 'monthly';
}

export interface TodoRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // 반복 간격
  endDate?: Date;
  endOccurrences?: number;
  daysOfWeek?: number[]; // 0=일요일, 6=토요일
  daysOfMonth?: number[]; // 1-31
  monthsOfYear?: number[]; // 1-12
}

export interface TodoAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'other';
  url: string;
  size: number;
  createdAt: Date;
}

export interface TodoFilter {
  status?: TodoStatus[];
  priority?: TodoPriority[];
  category?: TodoCategory[];
  tags?: string[];
  dueDateRange?: {
    start: Date;
    end: Date;
  };
  createdDateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
  hasSubtasks?: boolean;
  isOverdue?: boolean;
}

export interface TodoSortOption {
  field: 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface TodoStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
  averageCompletionTime: number; // 평균 완료 시간 (분)
}

export interface TodoTemplate {
  id: string;
  name: string;
  description?: string;
  category: TodoCategory;
  priority: TodoPriority;
  estimatedTime?: number;
  tags: string[];
  subtasks?: Omit<TodoSubtask, 'id' | 'createdAt'>[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  stats: TodoStats;
  filter: TodoFilter;
  sortOption: TodoSortOption;
  createTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodoStatus: (id: string) => Promise<void>;
  setFilter: (filter: Partial<TodoFilter>) => void;
  setSortOption: (sortOption: TodoSortOption) => void;
  getTodosByDate: (date: Date) => Todo[];
  getOverdueTodos: () => Todo[];
  duplicateTodo: (id: string) => Promise<void>;
  createFromTemplate: (templateId: string) => Promise<void>;
}
