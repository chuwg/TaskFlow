// 가계부 관련 타입 정의

export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_payment' | 'cryptocurrency' | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  accountId?: string; // 계좌 ID
  toAccountId?: string; // 이체의 경우 대상 계좌 ID
  tags: string[];
  location?: string;
  merchant?: string;
  receipt?: string; // 영수증 이미지 URL
  notes?: string;
  isRecurring?: boolean;
  recurrence?: TransactionRecurrence;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  endOccurrences?: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  monthsOfYear?: number[];
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other';
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  parentId?: string;
  color: string;
  icon?: string;
  isDefault: boolean;
  budget?: number; // 월 예산
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  spent: number;
  remaining: number;
  isActive: boolean;
  alertThreshold: number; // 예산 사용률 알림 임계값 (0-100)
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'savings' | 'debt_payment' | 'investment' | 'purchase' | 'other';
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialReport {
  period: {
    start: Date;
    end: Date;
  };
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrend: MonthlyTrend[];
  topExpenses: Transaction[];
  budgetStatus: BudgetStatus[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  netIncome: number;
}

export interface BudgetStatus {
  budgetId: string;
  budgetName: string;
  spent: number;
  budgeted: number;
  remaining: number;
  percentage: number;
  status: 'under' | 'over' | 'at_limit';
}

export interface TransactionFilter {
  type?: TransactionType[];
  status?: TransactionStatus[];
  category?: string[];
  paymentMethod?: PaymentMethod[];
  accountId?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchQuery?: string;
}

export interface TransactionSortOption {
  field: 'date' | 'amount' | 'description' | 'category' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface FinanceStats {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyNetIncome: number;
  accountBalances: { [accountId: string]: number };
  categoryTotals: { [categoryId: string]: number };
  budgetStatus: BudgetStatus[];
  goalProgress: { [goalId: string]: number };
}

export interface FinanceContextType {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  budgets: Budget[];
  goals: FinancialGoal[];
  loading: boolean;
  error: string | null;
  stats: FinanceStats;
  filter: TransactionFilter;
  sortOption: TransactionSortOption;
  
  // Transaction methods
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Account methods
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  // Category methods
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Budget methods
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  // Goal methods
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<FinancialGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  // Filter and sort
  setFilter: (filter: Partial<TransactionFilter>) => void;
  setSortOption: (sortOption: TransactionSortOption) => void;
  
  // Reports
  generateReport: (startDate: Date, endDate: Date) => Promise<FinancialReport>;
  getTransactionsByDate: (date: Date) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
}
