// 노트 관리 관련 타입 정의

export type NoteStatus = 'draft' | 'published' | 'archived';
export type NoteType = 'text' | 'markdown' | 'checklist' | 'drawing' | 'voice' | 'mixed';
export type NotePriority = 'low' | 'medium' | 'high';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  status: NoteStatus;
  priority: NotePriority;
  tags: string[];
  category?: string;
  color?: string;
  isPinned: boolean;
  isFavorite: boolean;
  isEncrypted: boolean;
  password?: string; // 암호화된 비밀번호
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
  wordCount: number;
  readingTime: number; // 예상 읽기 시간 (분)
  attachments: NoteAttachment[];
  collaborators: NoteCollaborator[];
  version: number;
  previousVersions: NoteVersion[];
  reminders: NoteReminder[];
  linkedNotes: string[]; // 연결된 노트 ID들
  linkedTodos: string[]; // 연결된 할일 ID들
  linkedTransactions: string[]; // 연결된 거래 ID들
  linkedCalendarEvents: string[]; // 연결된 캘린더 이벤트 ID들
}

export interface NoteAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'drawing' | 'other';
  url: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

export interface NoteCollaborator {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'viewer' | 'editor' | 'admin';
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
  addedAt: Date;
}

export interface NoteVersion {
  id: string;
  version: number;
  content: string;
  title: string;
  createdAt: Date;
  createdBy: string;
  changeDescription?: string;
}

export interface NoteReminder {
  id: string;
  title: string;
  date: Date;
  isCompleted: boolean;
  completedAt?: Date;
  type: 'notification' | 'email' | 'both';
  repeat?: 'once' | 'daily' | 'weekly' | 'monthly';
}

export interface NoteTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  type: NoteType;
  category?: string;
  tags: string[];
  isPublic: boolean;
  isDefault: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface NoteFilter {
  status?: NoteStatus[];
  type?: NoteType[];
  priority?: NotePriority[];
  tags?: string[];
  category?: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
  isEncrypted?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
  hasAttachments?: boolean;
  hasReminders?: boolean;
  hasCollaborators?: boolean;
}

export interface NoteSortOption {
  field: 'title' | 'createdAt' | 'updatedAt' | 'lastAccessedAt' | 'priority' | 'wordCount';
  direction: 'asc' | 'desc';
}

export interface NoteSearchResult {
  note: Note;
  relevanceScore: number;
  matchedFields: string[];
  highlightedContent: string;
}

export interface NoteStats {
  total: number;
  draft: number;
  published: number;
  archived: number;
  pinned: number;
  favorites: number;
  encrypted: number;
  totalWords: number;
  averageWords: number;
  totalReadingTime: number;
  averageReadingTime: number;
  notesThisWeek: number;
  notesThisMonth: number;
  mostUsedTags: { tag: string; count: number }[];
  mostUsedCategories: { category: string; count: number }[];
}

export interface NoteExportOptions {
  format: 'markdown' | 'html' | 'pdf' | 'txt' | 'json';
  includeAttachments: boolean;
  includeMetadata: boolean;
  includeVersions: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  category?: string;
}

export interface NoteImportOptions {
  format: 'markdown' | 'html' | 'txt' | 'json' | 'evernote' | 'onenote';
  mergeStrategy: 'create_new' | 'merge_existing' | 'replace_existing';
  preserveMetadata: boolean;
  category?: string;
  tags?: string[];
}

export interface NoteContextType {
  notes: Note[];
  templates: NoteTemplate[];
  loading: boolean;
  error: string | null;
  stats: NoteStats;
  filter: NoteFilter;
  sortOption: NoteSortOption;
  searchQuery: string;
  searchResults: NoteSearchResult[];
  
  // Note CRUD
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'lastAccessedAt' | 'version' | 'wordCount' | 'readingTime'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  duplicateNote: (id: string) => Promise<void>;
  
  // Note operations
  pinNote: (id: string) => Promise<void>;
  unpinNote: (id: string) => Promise<void>;
  favoriteNote: (id: string) => Promise<void>;
  unfavoriteNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  unarchiveNote: (id: string) => Promise<void>;
  encryptNote: (id: string, password: string) => Promise<void>;
  decryptNote: (id: string, password: string) => Promise<void>;
  
  // Search and filter
  searchNotes: (query: string) => Promise<void>;
  setFilter: (filter: Partial<NoteFilter>) => void;
  setSortOption: (sortOption: NoteSortOption) => void;
  clearSearch: () => void;
  
  // Templates
  createTemplate: (template: Omit<NoteTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<NoteTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  createFromTemplate: (templateId: string) => Promise<void>;
  
  // Attachments
  addAttachment: (noteId: string, attachment: Omit<NoteAttachment, 'id' | 'createdAt'>) => Promise<void>;
  removeAttachment: (noteId: string, attachmentId: string) => Promise<void>;
  
  // Reminders
  addReminder: (noteId: string, reminder: Omit<NoteReminder, 'id'>) => Promise<void>;
  updateReminder: (noteId: string, reminderId: string, updates: Partial<NoteReminder>) => Promise<void>;
  removeReminder: (noteId: string, reminderId: string) => Promise<void>;
  
  // Collaboration
  addCollaborator: (noteId: string, collaborator: Omit<NoteCollaborator, 'id' | 'addedAt'>) => Promise<void>;
  updateCollaborator: (noteId: string, collaboratorId: string, updates: Partial<NoteCollaborator>) => Promise<void>;
  removeCollaborator: (noteId: string, collaboratorId: string) => Promise<void>;
  
  // Version control
  getNoteVersions: (noteId: string) => NoteVersion[];
  restoreVersion: (noteId: string, versionId: string) => Promise<void>;
  
  // Export/Import
  exportNotes: (noteIds: string[], options: NoteExportOptions) => Promise<string>;
  importNotes: (data: string, options: NoteImportOptions) => Promise<void>;
  
  // Utility
  getNotesByTag: (tag: string) => Note[];
  getNotesByCategory: (category: string) => Note[];
  getNotesByDate: (date: Date) => Note[];
  getLinkedNotes: (noteId: string) => Note[];
  linkNotes: (noteId1: string, noteId2: string) => Promise<void>;
  unlinkNotes: (noteId1: string, noteId2: string) => Promise<void>;
}
