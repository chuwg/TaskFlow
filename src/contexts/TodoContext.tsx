import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Todo,
  TodoStatus,
  TodoPriority,
  TodoCategory,
  TodoFilter,
  TodoSortOption,
  TodoStats,
  TodoTemplate,
} from '@/types/todo';

interface TodoState {
  todos: Todo[];
  templates: TodoTemplate[];
  loading: boolean;
  error: string | null;
  stats: TodoStats;
  filter: TodoFilter;
  sortOption: TodoSortOption;
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: Partial<Todo> } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<TodoFilter> }
  | { type: 'SET_SORT_OPTION'; payload: TodoSortOption }
  | { type: 'SET_TEMPLATES'; payload: TodoTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: TodoTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: { id: string; updates: Partial<TodoTemplate> } }
  | { type: 'DELETE_TEMPLATE'; payload: string };

const initialState: TodoState = {
  todos: [],
  templates: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    overdue: 0,
    completedToday: 0,
    completedThisWeek: 0,
    completedThisMonth: 0,
    averageCompletionTime: 0,
  },
  filter: {},
  sortOption: { field: 'createdAt', direction: 'desc' },
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates, updatedAt: new Date() }
            : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    case 'SET_SORT_OPTION':
      return {
        ...state,
        sortOption: action.payload,
      };
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map((template) =>
          template.id === action.payload.id
            ? { ...template, ...action.payload.updates, updatedAt: new Date() }
            : template
        ),
      };
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter((template) => template.id !== action.payload),
      };
    default:
      return state;
  }
};

interface TodoContextType {
  state: TodoState;
  // Todo CRUD
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodoStatus: (id: string) => Promise<void>;
  duplicateTodo: (id: string) => Promise<void>;
  
  // Filter and sort
  setFilter: (filter: Partial<TodoFilter>) => void;
  setSortOption: (sortOption: TodoSortOption) => void;
  clearFilter: () => void;
  
  // Queries
  getTodosByDate: (date: Date) => Todo[];
  getOverdueTodos: () => Todo[];
  getTodosByStatus: (status: TodoStatus) => Todo[];
  getTodosByPriority: (priority: TodoPriority) => Todo[];
  getTodosByCategory: (category: TodoCategory) => Todo[];
  
  // Templates
  createTemplate: (template: Omit<TodoTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<TodoTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  createFromTemplate: (templateId: string) => Promise<void>;
  
  // Stats
  updateStats: () => void;
  
  // Utility
  clearError: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TODOS: '@todos',
  TEMPLATES: '@todo_templates',
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load data from storage on mount
  useEffect(() => {
    loadTodos();
    loadTemplates();
  }, []);

  // Save todos to storage whenever todos change
  useEffect(() => {
    if (state.todos.length > 0 || state.loading) return;
    saveTodos();
  }, [state.todos]);

  // Update stats whenever todos change
  useEffect(() => {
    updateStats();
  }, [state.todos]);

  const loadTodos = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedTodos = await (AsyncStorage as any).getItem(STORAGE_KEYS.TODOS);
      if (storedTodos) {
        const todos = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
        dispatch({ type: 'SET_TODOS', payload: todos });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '할일을 불러오는데 실패했습니다.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const saveTodos = useCallback(async () => {
    try {
      await (AsyncStorage as any).setItem(STORAGE_KEYS.TODOS, JSON.stringify(state.todos));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '할일을 저장하는데 실패했습니다.' });
    }
  }, [state.todos]);

  const loadTemplates = useCallback(async () => {
    try {
      const storedTemplates = await (AsyncStorage as any).getItem(STORAGE_KEYS.TEMPLATES);
      if (storedTemplates) {
        const templates = JSON.parse(storedTemplates).map((template: any) => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt),
        }));
        dispatch({ type: 'SET_TEMPLATES', payload: templates });
      }
    } catch (error) {
      console.warn('템플릿을 불러오는데 실패했습니다:', error);
    }
  }, []);

  const saveTemplates = useCallback(async () => {
    try {
      await (AsyncStorage as any).setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(state.templates));
    } catch (error) {
      console.warn('템플릿을 저장하는데 실패했습니다:', error);
    }
  }, [state.templates]);

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTodo: Todo = {
        ...todoData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: 'ADD_TODO', payload: newTodo });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '할일을 추가하는데 실패했습니다.' });
    }
  }, []);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    try {
      dispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '할일을 수정하는데 실패했습니다.' });
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '할일을 삭제하는데 실패했습니다.' });
    }
  }, []);

  const toggleTodoStatus = useCallback(async (id: string) => {
    try {
      const todo = state.todos.find(t => t.id === id);
      if (!todo) return;

      let newStatus: TodoStatus;
      let completedAt: Date | undefined;

      switch (todo.status) {
        case 'pending':
          newStatus = 'in_progress';
          break;
        case 'in_progress':
          newStatus = 'completed';
          completedAt = new Date();
          break;
        case 'completed':
          newStatus = 'pending';
          break;
        case 'cancelled':
          newStatus = 'pending';
          break;
        default:
          newStatus = 'pending';
      }

      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          id,
          updates: {
            status: newStatus,
            completedAt,
          },
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '할일 상태를 변경하는데 실패했습니다.' });
    }
  }, [state.todos]);

  const duplicateTodo = useCallback(async (id: string) => {
    try {
      const todo = state.todos.find(t => t.id === id);
      if (!todo) return;

      const duplicatedTodo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> = {
        ...todo,
        title: `${todo.title} (복사본)`,
        status: 'pending',
        completedAt: undefined,
      };

      await addTodo(duplicatedTodo);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '할일을 복사하는데 실패했습니다.' });
    }
  }, [state.todos, addTodo]);

  const setFilter = useCallback((filter: Partial<TodoFilter>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const setSortOption = useCallback((sortOption: TodoSortOption) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: sortOption });
  }, []);

  const clearFilter = useCallback(() => {
    dispatch({ type: 'SET_FILTER', payload: {} });
  }, []);

  const getTodosByDate = useCallback((date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return state.todos.filter(todo => {
      if (!todo.dueDate) return false;
      return todo.dueDate >= startOfDay && todo.dueDate <= endOfDay;
    });
  }, [state.todos]);

  const getOverdueTodos = useCallback(() => {
    const now = new Date();
    return state.todos.filter(todo => {
      if (!todo.dueDate || todo.status === 'completed' || todo.status === 'cancelled') {
        return false;
      }
      return todo.dueDate < now;
    });
  }, [state.todos]);

  const getTodosByStatus = useCallback((status: TodoStatus) => {
    return state.todos.filter(todo => todo.status === status);
  }, [state.todos]);

  const getTodosByPriority = useCallback((priority: TodoPriority) => {
    return state.todos.filter(todo => todo.priority === priority);
  }, [state.todos]);

  const getTodosByCategory = useCallback((category: TodoCategory) => {
    return state.todos.filter(todo => todo.category === category);
  }, [state.todos]);

  const createTemplate = useCallback(async (templateData: Omit<TodoTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      const newTemplate: TodoTemplate = {
        ...templateData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      };
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      await saveTemplates();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '템플릿을 생성하는데 실패했습니다.' });
    }
  }, [saveTemplates]);

  const updateTemplate = useCallback(async (id: string, updates: Partial<TodoTemplate>) => {
    try {
      dispatch({ type: 'UPDATE_TEMPLATE', payload: { id, updates } });
      await saveTemplates();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '템플릿을 수정하는데 실패했습니다.' });
    }
  }, [saveTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'DELETE_TEMPLATE', payload: id });
      await saveTemplates();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '템플릿을 삭제하는데 실패했습니다.' });
    }
  }, [saveTemplates]);

  const createFromTemplate = useCallback(async (templateId: string) => {
    try {
      const template = state.templates.find(t => t.id === templateId);
      if (!template) return;

      const newTodo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> = {
        title: template.name,
        description: template.description || '',
        status: 'pending',
        priority: template.priority,
        category: template.category,
        estimatedTime: template.estimatedTime,
        tags: [...template.tags],
        subtasks: template.subtasks?.map(subtask => ({
          ...subtask,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        })),
      };

      await addTodo(newTodo);

      // Update template usage count
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: {
          id: templateId,
          updates: { usageCount: template.usageCount + 1 },
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '템플릿에서 할일을 생성하는데 실패했습니다.' });
    }
  }, [state.templates, addTodo]);

  const updateStats = useCallback(() => {
    const todos = state.todos;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: TodoStats = {
      total: todos.length,
      pending: todos.filter(t => t.status === 'pending').length,
      inProgress: todos.filter(t => t.status === 'in_progress').length,
      completed: todos.filter(t => t.status === 'completed').length,
      cancelled: todos.filter(t => t.status === 'cancelled').length,
      overdue: todos.filter(t => {
        if (!t.dueDate || t.status === 'completed' || t.status === 'cancelled') return false;
        return t.dueDate < now;
      }).length,
      completedToday: todos.filter(t => {
        if (t.status !== 'completed' || !t.completedAt) return false;
        return t.completedAt >= today;
      }).length,
      completedThisWeek: todos.filter(t => {
        if (t.status !== 'completed' || !t.completedAt) return false;
        return t.completedAt >= weekStart;
      }).length,
      completedThisMonth: todos.filter(t => {
        if (t.status !== 'completed' || !t.completedAt) return false;
        return t.completedAt >= monthStart;
      }).length,
      averageCompletionTime: 0, // TODO: Calculate based on actual completion times
    };

    // Calculate average completion time
    const completedTodos = todos.filter(t => t.status === 'completed' && t.actualTime);
    if (completedTodos.length > 0) {
      const totalTime = completedTodos.reduce((sum, t) => sum + (t.actualTime || 0), 0);
      stats.averageCompletionTime = totalTime / completedTodos.length;
    }
  }, [state.todos]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value: TodoContextType = {
    state,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    duplicateTodo,
    setFilter,
    setSortOption,
    clearFilter,
    getTodosByDate,
    getOverdueTodos,
    getTodosByStatus,
    getTodosByPriority,
    getTodosByCategory,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createFromTemplate,
    updateStats,
    clearError,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};
