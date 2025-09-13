import { useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { useCalendar } from '@/contexts/CalendarContext';
import type { Transaction, CalendarEvent } from '@/types/finance';
import type { CalendarEvent as CalendarEventType } from '@/types/calendar';

export function useFinanceCalendarIntegration() {
  const { transactions, getTransactionsByDate } = useFinance();
  const { events, addEvent, updateEvent, deleteEvent } = useCalendar();

  // 거래를 캘린더 이벤트로 변환
  const convertTransactionToEvent = (transaction: Transaction): CalendarEventType => {
    const isIncome = transaction.type === 'income';
    const isExpense = transaction.type === 'expense';
    const isTransfer = transaction.type === 'transfer';

    let title = '';
    let color = '';

    if (isIncome) {
      title = `💰 ${transaction.description}`;
      color = '#4CAF50';
    } else if (isExpense) {
      title = `💸 ${transaction.description}`;
      color = '#F44336';
    } else if (isTransfer) {
      title = `🔄 ${transaction.description}`;
      color = '#2196F3';
    }

    return {
      id: `finance_${transaction.id}`,
      title,
      description: `금액: ${transaction.amount.toLocaleString('ko-KR')}원\n카테고리: ${transaction.category}\n결제수단: ${transaction.paymentMethod}`,
      start: transaction.date,
      end: transaction.date,
      color,
      type: 'finance',
      metadata: {
        transactionId: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        paymentMethod: transaction.paymentMethod,
      },
    };
  };

  // 캘린더 이벤트를 거래로 변환
  const convertEventToTransaction = (event: CalendarEventType): Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> => {
    const metadata = event.metadata as any;
    
    return {
      type: metadata?.type || 'expense',
      amount: metadata?.amount || 0,
      currency: 'KRW',
      category: metadata?.category || '',
      description: event.title.replace(/[💰💸🔄]/g, '').trim(),
      date: event.start,
      status: 'completed',
      paymentMethod: metadata?.paymentMethod || 'cash',
      tags: [],
    };
  };

  // 거래를 캘린더에 동기화
  const syncTransactionsToCalendar = async () => {
    try {
      // 기존 금융 이벤트 제거
      const existingFinanceEvents = events.filter(event => event.type === 'finance');
      for (const event of existingFinanceEvents) {
        await deleteEvent(event.id);
      }

      // 거래를 캘린더 이벤트로 추가
      for (const transaction of transactions) {
        const event = convertTransactionToEvent(transaction);
        await addEvent(event);
      }
    } catch (error) {
      console.error('캘린더 동기화 오류:', error);
    }
  };

  // 특정 날짜의 거래를 캘린더 이벤트로 가져오기
  const getFinanceEventsForDate = (date: Date): CalendarEventType[] => {
    const dayTransactions = getTransactionsByDate(date);
    return dayTransactions.map(convertTransactionToEvent);
  };

  // 특정 날짜의 금융 이벤트들
  const financeEvents = useMemo(() => {
    return events.filter(event => event.type === 'finance');
  }, [events]);

  // 월별 거래 통계
  const getMonthlyTransactionStats = (year: number, month: number) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const monthlyTransactions = transactions.filter(t => 
      t.date >= startDate && t.date <= endDate && t.status === 'completed'
    );

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const transfer = monthlyTransactions
      .filter(t => t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      transfer,
      netIncome: income - expense,
      transactionCount: monthlyTransactions.length,
    };
  };

  // 일별 거래 통계
  const getDailyTransactionStats = (date: Date) => {
    const dayTransactions = getTransactionsByDate(date);
    const completedTransactions = dayTransactions.filter(t => t.status === 'completed');

    const income = completedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = completedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const transfer = completedTransactions
      .filter(t => t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      transfer,
      netIncome: income - expense,
      transactionCount: completedTransactions.length,
    };
  };

  // 카테고리별 월간 지출 통계
  const getCategoryExpenseStats = (year: number, month: number) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const monthlyExpenses = transactions.filter(t => 
      t.type === 'expense' && 
      t.status === 'completed' &&
      t.date >= startDate && 
      t.date <= endDate
    );

    const categoryStats = new Map<string, { amount: number; count: number }>();
    
    monthlyExpenses.forEach(transaction => {
      const existing = categoryStats.get(transaction.category) || { amount: 0, count: 0 };
      categoryStats.set(transaction.category, {
        amount: existing.amount + transaction.amount,
        count: existing.count + 1,
      });
    });

    return Array.from(categoryStats.entries()).map(([category, stats]) => ({
      category,
      amount: stats.amount,
      count: stats.count,
    }));
  };

  // 예산 사용률 계산
  const getBudgetUsage = (budgetCategoryId: string, year: number, month: number) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const categoryExpenses = transactions.filter(t => 
      t.category === budgetCategoryId &&
      t.type === 'expense' &&
      t.status === 'completed' &&
      t.date >= startDate &&
      t.date <= endDate
    );

    const totalSpent = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalSpent,
      transactionCount: categoryExpenses.length,
      averageTransaction: categoryExpenses.length > 0 ? totalSpent / categoryExpenses.length : 0,
    };
  };

  // 거래 패턴 분석
  const analyzeTransactionPatterns = (year: number, month: number) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const monthlyTransactions = transactions.filter(t => 
      t.date >= startDate && t.date <= endDate && t.status === 'completed'
    );

    // 요일별 지출 패턴
    const dayOfWeekStats = new Array(7).fill(0).map(() => ({ income: 0, expense: 0, count: 0 }));
    
    monthlyTransactions.forEach(transaction => {
      const dayOfWeek = transaction.date.getDay();
      if (transaction.type === 'income') {
        dayOfWeekStats[dayOfWeek].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        dayOfWeekStats[dayOfWeek].expense += transaction.amount;
      }
      dayOfWeekStats[dayOfWeek].count++;
    });

    // 시간대별 지출 패턴 (시간 정보가 있는 경우)
    const hourlyStats = new Array(24).fill(0).map(() => ({ income: 0, expense: 0, count: 0 }));
    
    monthlyTransactions.forEach(transaction => {
      const hour = transaction.date.getHours();
      if (transaction.type === 'income') {
        hourlyStats[hour].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        hourlyStats[hour].expense += transaction.amount;
      }
      hourlyStats[hour].count++;
    });

    return {
      dayOfWeekStats,
      hourlyStats,
      totalTransactions: monthlyTransactions.length,
    };
  };

  return {
    financeEvents,
    convertTransactionToEvent,
    convertEventToTransaction,
    syncTransactionsToCalendar,
    getFinanceEventsForDate,
    getMonthlyTransactionStats,
    getDailyTransactionStats,
    getCategoryExpenseStats,
    getBudgetUsage,
    analyzeTransactionPatterns,
  };
}
