// 공통 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    reminder: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
}

// 모듈별 타입들을 re-export
export * from './calendar.js';
export * from './todo.js';
export * from './finance.js';
export * from './note.js';
export * from './navigation.js';
export * from './settings.js';
export * from './theme.js';

// 공통 유틸리티 타입
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 앱 전체 상태 타입
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastSyncAt: Date | null;
  offlineMode: boolean;
}
