import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  FinanceContextType, 
  Transaction, 
  Account, 
  Category, 
  Budget, 
  FinancialGoal,
  TransactionFilter,
  TransactionSortOption,
  FinanceStats,
  FinancialReport,
  CategoryBreakdown,
  MonthlyTrend,
  BudgetStatus
} from '@/types/finance';

// 초기 상태
const initialState = {
  transactions: [] as Transaction[],
  accounts: [] as Account[],
  categories: [] as Category[],
  budgets: [] as Budget[],
  goals: [] as FinancialGoal[],
  loading: false,
  error: null as string | null,
  stats: {
    totalIncome: 0,
    totalExpense: 0,
    netIncome: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyNetIncome: 0,
    accountBalances: {},
    categoryTotals: {},
    budgetStatus: [],
    goalProgress: {},
  } as FinanceStats,
  filter: {
    type: undefined,
    status: undefined,
    category: undefined,
    paymentMethod: undefined,
    accountId: undefined,
    amountRange: undefined,
    dateRange: undefined,
    tags: undefined,
    searchQuery: undefined,
  } as TransactionFilter,
  sortOption: {
    field: 'date' as const,
    direction: 'desc' as const,
  } as TransactionSortOption,
};

// 액션 타입
type FinanceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; updates: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; updates: Partial<Account> } }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: { id: string; updates: Partial<Budget> } }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'SET_GOALS'; payload: FinancialGoal[] }
  | { type: 'ADD_GOAL'; payload: FinancialGoal }
  | { type: 'UPDATE_GOAL'; payload: { id: string; updates: Partial<FinancialGoal> } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<TransactionFilter> }
  | { type: 'SET_SORT_OPTION'; payload: TransactionSortOption }
  | { type: 'UPDATE_STATS'; payload: FinanceStats };

// 리듀서
function financeReducer(state: typeof initialState, action: FinanceAction): typeof initialState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates, updatedAt: new Date() } : t
        ),
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates, updatedAt: new Date() } : a
        ),
      };
    
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(a => a.id !== action.payload),
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates, updatedAt: new Date() } : c
        ),
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload.updates, updatedAt: new Date() } : b
        ),
      };
    
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload),
      };
    
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g =>
          g.id === action.payload.id ? { ...g, ...action.payload.updates, updatedAt: new Date() } : g
        ),
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
      };
    
    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.payload } };
    
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    
    case 'UPDATE_STATS':
      return { ...state, stats: action.payload };
    
    default:
      return state;
  }
}

// 통계 계산 함수
function calculateStats(
  transactions: Transaction[],
  accounts: Account[],
  categories: Category[],
  budgets: Budget[],
  goals: FinancialGoal[]
): FinanceStats {
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  const monthlyTransactions = transactions.filter(t => 
    t.date >= currentMonth && t.date < nextMonth
  );
  
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const accountBalances: { [accountId: string]: number } = {};
  accounts.forEach(account => {
    const accountTransactions = transactions.filter(t => 
      t.accountId === account.id && t.status === 'completed'
    );
    const balance = accountTransactions.reduce((sum, t) => {
      if (t.type === 'income') return sum + t.amount;
      if (t.type === 'expense') return sum - t.amount;
      return sum;
    }, account.balance);
    accountBalances[account.id] = balance;
  });
  
  const categoryTotals: { [categoryId: string]: number } = {};
  categories.forEach(category => {
    const categoryTransactions = transactions.filter(t => 
      t.category === category.id && t.status === 'completed'
    );
    const total = categoryTransactions.reduce((sum, t) => {
      if (t.type === 'expense') return sum + t.amount;
      return sum;
    }, 0);
    categoryTotals[category.id] = total;
  });
  
  const budgetStatus: BudgetStatus[] = budgets.map(budget => {
    const spent = transactions
      .filter(t => 
        t.category === budget.categoryId && 
        t.type === 'expense' && 
        t.status === 'completed' &&
        t.date >= budget.startDate &&
        t.date <= budget.endDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const remaining = budget.amount - spent;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    let status: 'under' | 'over' | 'at_limit' = 'under';
    if (percentage >= 100) status = 'over';
    else if (percentage >= 90) status = 'at_limit';
    
    return {
      budgetId: budget.id,
      budgetName: budget.name,
      spent,
      budgeted: budget.amount,
      remaining,
      percentage,
      status,
    };
  });
  
  const goalProgress: { [goalId: string]: number } = {};
  goals.forEach(goal => {
    if (goal.targetAmount > 0) {
      goalProgress[goal.id] = (goal.currentAmount / goal.targetAmount) * 100;
    }
  });
  
  return {
    totalIncome,
    totalExpense,
    netIncome: totalIncome - totalExpense,
    monthlyIncome,
    monthlyExpense,
    monthlyNetIncome: monthlyIncome - monthlyExpense,
    accountBalances,
    categoryTotals,
    budgetStatus,
    goalProgress,
  };
}

// 컨텍스트 생성
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Provider 컴포넌트
export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // 통계 업데이트
  useEffect(() => {
    const stats = calculateStats(
      state.transactions,
      state.accounts,
      state.categories,
      state.budgets,
      state.goals
    );
    dispatch({ type: 'UPDATE_STATS', payload: stats });
  }, [state.transactions, state.accounts, state.categories, state.budgets, state.goals]);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [transactionsData, accountsData, categoriesData, budgetsData, goalsData] = await Promise.all([
        (AsyncStorage as any).getItem('finance_transactions'),
        (AsyncStorage as any).getItem('finance_accounts'),
        (AsyncStorage as any).getItem('finance_categories'),
        (AsyncStorage as any).getItem('finance_budgets'),
        (AsyncStorage as any).getItem('finance_goals'),
      ]);

      if (transactionsData) {
        const transactions = JSON.parse(transactionsData).map((t: any) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }));
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      }

      if (accountsData) {
        const accounts = JSON.parse(accountsData).map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        }));
        dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
      }

      if (categoriesData) {
        const categories = JSON.parse(categoriesData).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        }));
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
      } else {
        // 기본 카테고리 생성
        const defaultCategories: Category[] = [
          {
            id: 'income-salary',
            name: '급여',
            type: 'income',
            color: '#4CAF50',
            icon: '💰',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'income-bonus',
            name: '보너스',
            type: 'income',
            color: '#8BC34A',
            icon: '🎁',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'expense-food',
            name: '식비',
            type: 'expense',
            color: '#FF9800',
            icon: '🍽️',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'expense-transport',
            name: '교통비',
            type: 'expense',
            color: '#2196F3',
            icon: '🚗',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'expense-shopping',
            name: '쇼핑',
            type: 'expense',
            color: '#E91E63',
            icon: '🛍️',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'expense-entertainment',
            name: '엔터테인먼트',
            type: 'expense',
            color: '#9C27B0',
            icon: '🎬',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        dispatch({ type: 'SET_CATEGORIES', payload: defaultCategories });
        await (AsyncStorage as any).setItem('finance_categories', JSON.stringify(defaultCategories));
      }

      if (budgetsData) {
        const budgets = JSON.parse(budgetsData).map((b: any) => ({
          ...b,
          startDate: new Date(b.startDate),
          endDate: new Date(b.endDate),
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt),
        }));
        dispatch({ type: 'SET_BUDGETS', payload: budgets });
      }

      if (goalsData) {
        const goals = JSON.parse(goalsData).map((g: any) => ({
          ...g,
          targetDate: new Date(g.targetDate),
          completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
          createdAt: new Date(g.createdAt),
          updatedAt: new Date(g.updatedAt),
        }));
        dispatch({ type: 'SET_GOALS', payload: goals });
      }

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '데이터를 불러오는 중 오류가 발생했습니다.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Transaction methods
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const transaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      const updatedTransactions = [...state.transactions, transaction];
      await (AsyncStorage as any).setItem('finance_transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '거래를 추가하는 중 오류가 발생했습니다.' });
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, updates } });
      
      const updatedTransactions = state.transactions.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      );
      await (AsyncStorage as any).setItem('finance_transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '거래를 업데이트하는 중 오류가 발생했습니다.' });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      
      const updatedTransactions = state.transactions.filter(t => t.id !== id);
      await (AsyncStorage as any).setItem('finance_transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '거래를 삭제하는 중 오류가 발생했습니다.' });
    }
  };

  // Account methods
  const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const account: Account = {
        ...accountData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'ADD_ACCOUNT', payload: account });
      
      const updatedAccounts = [...state.accounts, account];
      await (AsyncStorage as any).setItem('finance_accounts', JSON.stringify(updatedAccounts));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '계좌를 추가하는 중 오류가 발생했습니다.' });
    }
  };

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    try {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, updates } });
      
      const updatedAccounts = state.accounts.map(a =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      );
      await (AsyncStorage as any).setItem('finance_accounts', JSON.stringify(updatedAccounts));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '계좌를 업데이트하는 중 오류가 발생했습니다.' });
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
      
      const updatedAccounts = state.accounts.filter(a => a.id !== id);
      await (AsyncStorage as any).setItem('finance_accounts', JSON.stringify(updatedAccounts));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '계좌를 삭제하는 중 오류가 발생했습니다.' });
    }
  };

  // Category methods
  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const category: Category = {
        ...categoryData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'ADD_CATEGORY', payload: category });
      
      const updatedCategories = [...state.categories, category];
      await (AsyncStorage as any).setItem('finance_categories', JSON.stringify(updatedCategories));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '카테고리를 추가하는 중 오류가 발생했습니다.' });
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates } });
      
      const updatedCategories = state.categories.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
      );
      await (AsyncStorage as any).setItem('finance_categories', JSON.stringify(updatedCategories));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '카테고리를 업데이트하는 중 오류가 발생했습니다.' });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
      
      const updatedCategories = state.categories.filter(c => c.id !== id);
      await (AsyncStorage as any).setItem('finance_categories', JSON.stringify(updatedCategories));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '카테고리를 삭제하는 중 오류가 발생했습니다.' });
    }
  };

  // Budget methods
  const addBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const budget: Budget = {
        ...budgetData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'ADD_BUDGET', payload: budget });
      
      const updatedBudgets = [...state.budgets, budget];
      await (AsyncStorage as any).setItem('finance_budgets', JSON.stringify(updatedBudgets));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '예산을 추가하는 중 오류가 발생했습니다.' });
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      dispatch({ type: 'UPDATE_BUDGET', payload: { id, updates } });
      
      const updatedBudgets = state.budgets.map(b =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
      );
      await (AsyncStorage as any).setItem('finance_budgets', JSON.stringify(updatedBudgets));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '예산을 업데이트하는 중 오류가 발생했습니다.' });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_BUDGET', payload: id });
      
      const updatedBudgets = state.budgets.filter(b => b.id !== id);
      await (AsyncStorage as any).setItem('finance_budgets', JSON.stringify(updatedBudgets));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '예산을 삭제하는 중 오류가 발생했습니다.' });
    }
  };

  // Goal methods
  const addGoal = async (goalData: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const goal: FinancialGoal = {
        ...goalData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'ADD_GOAL', payload: goal });
      
      const updatedGoals = [...state.goals, goal];
      await (AsyncStorage as any).setItem('finance_goals', JSON.stringify(updatedGoals));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '목표를 추가하는 중 오류가 발생했습니다.' });
    }
  };

  const updateGoal = async (id: string, updates: Partial<FinancialGoal>) => {
    try {
      dispatch({ type: 'UPDATE_GOAL', payload: { id, updates } });
      
      const updatedGoals = state.goals.map(g =>
        g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
      );
      await (AsyncStorage as any).setItem('finance_goals', JSON.stringify(updatedGoals));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '목표를 업데이트하는 중 오류가 발생했습니다.' });
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_GOAL', payload: id });
      
      const updatedGoals = state.goals.filter(g => g.id !== id);
      await (AsyncStorage as any).setItem('finance_goals', JSON.stringify(updatedGoals));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '목표를 삭제하는 중 오류가 발생했습니다.' });
    }
  };

  // Filter and sort
  const setFilter = (filter: Partial<TransactionFilter>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSortOption = (sortOption: TransactionSortOption) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: sortOption });
  };

  // Reports
  const generateReport = async (startDate: Date, endDate: Date): Promise<FinancialReport> => {
    const filteredTransactions = state.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate && t.status === 'completed'
    );

    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown: CategoryBreakdown[] = [];
    const categoryMap = new Map<string, { amount: number; count: number }>();

    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const existing = categoryMap.get(transaction.category) || { amount: 0, count: 0 };
        categoryMap.set(transaction.category, {
          amount: existing.amount + transaction.amount,
          count: existing.count + 1,
        });
      }
    });

    categoryMap.forEach((data, categoryId) => {
      const category = state.categories.find(c => c.id === categoryId);
      if (category) {
        categoryBreakdown.push({
          categoryId,
          categoryName: category.name,
          amount: data.amount,
          percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
          transactionCount: data.count,
        });
      }
    });

    // 월별 트렌드 계산
    const monthlyTrend: MonthlyTrend[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const monthTransactions = filteredTransactions.filter(t => 
        t.date >= monthStart && t.date <= monthEnd
      );
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthExpense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyTrend.push({
        month: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
        income: monthIncome,
        expense: monthExpense,
        netIncome: monthIncome - monthExpense,
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const topExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    const budgetStatus: BudgetStatus[] = state.budgets
      .filter(b => b.startDate <= endDate && b.endDate >= startDate)
      .map(budget => {
        const spent = filteredTransactions
          .filter(t => t.category === budget.categoryId && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        
        let status: 'under' | 'over' | 'at_limit' = 'under';
        if (percentage >= 100) status = 'over';
        else if (percentage >= 90) status = 'at_limit';
        
        return {
          budgetId: budget.id,
          budgetName: budget.name,
          spent,
          budgeted: budget.amount,
          remaining,
          percentage,
          status,
        };
      });

    return {
      period: { start: startDate, end: endDate },
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
      categoryBreakdown,
      monthlyTrend,
      topExpenses,
      budgetStatus,
    };
  };

  const getTransactionsByDate = (date: Date): Transaction[] => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return state.transactions.filter(t => 
      t.date >= startOfDay && t.date <= endOfDay
    );
  };

  const getTransactionsByCategory = (categoryId: string): Transaction[] => {
    return state.transactions.filter(t => t.category === categoryId);
  };

  const contextValue: FinanceContextType = {
    ...state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    setFilter,
    setSortOption,
    generateReport,
    getTransactionsByDate,
    getTransactionsByCategory,
  };

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
}

// Hook
export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
