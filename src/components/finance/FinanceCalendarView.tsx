import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  Chip,
  IconButton,
  FAB,
  Modal,
  Button,
} from 'react-native-paper';
import { Calendar } from '@/components/calendar/Calendar';
import { useFinance } from '@/contexts/FinanceContext';
import { useFinanceCalendarIntegration } from '@/hooks/useFinanceCalendarIntegration';
import { useTheme } from '@/hooks/useTheme';
import { TransactionForm } from './TransactionForm.js';
import { TransactionList } from './TransactionList.js';
import type { Transaction } from '@/types/finance';

interface FinanceCalendarViewProps {
  onAddTransaction?: () => void;
}

export function FinanceCalendarView({ onAddTransaction }: FinanceCalendarViewProps) {
  const { colors, spacing } = useTheme();
  const { transactions, getTransactionsByDate } = useFinance();
  const { 
    getFinanceEventsForDate, 
    getDailyTransactionStats,
    getMonthlyTransactionStats 
  } = useFinanceCalendarIntegration();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showTransactionList, setShowTransactionList] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // 선택된 날짜의 거래 통계
  const dailyStats = useMemo(() => {
    return getDailyTransactionStats(selectedDate);
  }, [selectedDate, transactions]);

  // 선택된 날짜의 거래 목록
  const dayTransactions = useMemo(() => {
    return getTransactionsByDate(selectedDate);
  }, [selectedDate, transactions]);

  // 선택된 날짜의 금융 이벤트
  const financeEvents = useMemo(() => {
    return getFinanceEventsForDate(selectedDate);
  }, [selectedDate, transactions]);

  // 월별 통계
  const monthlyStats = useMemo(() => {
    return getMonthlyTransactionStats(selectedDate.getFullYear(), selectedDate.getMonth());
  }, [selectedDate, transactions]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowTransactionForm(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleTransactionFormClose = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'income': return 'plus';
      case 'expense': return 'minus';
      case 'transfer': return 'swap-horizontal';
      default: return 'circle';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'income': return colors.primary;
      case 'expense': return colors.error;
      case 'transfer': return colors.secondary;
      default: return colors.onSurface;
    }
  };

  const renderDailySummary = () => (
    <Card style={styles.summaryCard}>
      <Card.Content>
        <View style={styles.summaryHeader}>
          <Text variant="titleMedium">
            {selectedDate.toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long' 
            })}
          </Text>
          <TouchableOpacity onPress={() => setShowTransactionList(true)}>
            <Text variant="bodySmall" style={styles.viewAllText}>
              전체 보기
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>수입</Text>
            <Text variant="titleMedium" style={[styles.statValue, { color: colors.primary }]}>
              +{formatCurrency(dailyStats.income)}원
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>지출</Text>
            <Text variant="titleMedium" style={[styles.statValue, { color: colors.error }]}>
              -{formatCurrency(dailyStats.expense)}원
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>순수익</Text>
            <Text 
              variant="titleLarge" 
              style={[
                styles.statValue, 
                { color: dailyStats.netIncome >= 0 ? colors.primary : colors.error }
              ]}
            >
              {dailyStats.netIncome >= 0 ? '+' : ''}{formatCurrency(dailyStats.netIncome)}원
            </Text>
          </View>
        </View>

        <View style={styles.transactionCount}>
          <Text variant="bodySmall" style={styles.countText}>
            총 {dailyStats.transactionCount}건의 거래
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderMonthlySummary = () => (
    <Card style={styles.monthlyCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.monthlyTitle}>
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 요약
        </Text>
        <View style={styles.monthlyStats}>
          <View style={styles.monthlyStatItem}>
            <Text variant="bodySmall">월 수입</Text>
            <Text variant="bodyMedium" style={{ color: colors.primary }}>
              {formatCurrency(monthlyStats.income)}원
            </Text>
          </View>
          <View style={styles.monthlyStatItem}>
            <Text variant="bodySmall">월 지출</Text>
            <Text variant="bodyMedium" style={{ color: colors.error }}>
              {formatCurrency(monthlyStats.expense)}원
            </Text>
          </View>
          <View style={styles.monthlyStatItem}>
            <Text variant="bodySmall">월 순수익</Text>
            <Text 
              variant="bodyMedium" 
              style={{ color: monthlyStats.netIncome >= 0 ? colors.primary : colors.error }}
            >
              {monthlyStats.netIncome >= 0 ? '+' : ''}{formatCurrency(monthlyStats.netIncome)}원
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderRecentTransactions = () => {
    if (dayTransactions.length === 0) {
      return (
        <Card style={styles.transactionsCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.emptyText}>
              이 날짜에 거래 내역이 없습니다.
            </Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.transactionsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.transactionsTitle}>
            최근 거래
          </Text>
          {dayTransactions.slice(0, 3).map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              onPress={() => handleEditTransaction(transaction)}
              style={styles.transactionItem}
            >
              <View style={styles.transactionInfo}>
                <Text variant="bodyMedium" style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text variant="bodySmall" style={styles.transactionCategory}>
                  {transaction.category}
                </Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.transactionAmountText,
                    { color: getTransactionTypeColor(transaction.type) }
                  ]}
                >
                  {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}원
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {dayTransactions.length > 3 && (
            <TouchableOpacity 
              onPress={() => setShowTransactionList(true)}
              style={styles.viewMoreButton}
            >
              <Text variant="bodySmall" style={styles.viewMoreText}>
                {dayTransactions.length - 3}건 더 보기
              </Text>
            </TouchableOpacity>
          )}
        </Card.Content>
      </Card>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    calendarContainer: {
      margin: spacing.md,
    },
    summaryCard: {
      margin: spacing.md,
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    viewAllText: {
      color: colors.primary,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.md,
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      color: colors.onSurfaceVariant,
      marginBottom: spacing.xs,
    },
    statValue: {
      fontWeight: 'bold',
    },
    transactionCount: {
      alignItems: 'center',
    },
    countText: {
      color: colors.onSurfaceVariant,
    },
    monthlyCard: {
      margin: spacing.md,
    },
    monthlyTitle: {
      marginBottom: spacing.md,
      fontWeight: '600',
    },
    monthlyStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    monthlyStatItem: {
      alignItems: 'center',
    },
    transactionsCard: {
      margin: spacing.md,
    },
    transactionsTitle: {
      marginBottom: spacing.md,
      fontWeight: '600',
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      marginBottom: spacing.xs,
    },
    transactionCategory: {
      color: colors.onSurfaceVariant,
    },
    transactionAmount: {
      alignItems: 'flex-end',
    },
    transactionAmountText: {
      fontWeight: 'bold',
    },
    viewMoreButton: {
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    viewMoreText: {
      color: colors.primary,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.onSurfaceVariant,
      paddingVertical: spacing.lg,
    },
    fab: {
      position: 'absolute',
      margin: spacing.md,
      right: 0,
      bottom: 0,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            events={financeEvents}
          />
        </View>

        {renderMonthlySummary()}
        {renderDailySummary()}
        {renderRecentTransactions()}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddTransaction}
      />

      {/* 거래 추가/수정 모달 */}
      <Modal
        visible={showTransactionForm}
        onDismiss={handleTransactionFormClose}
        contentContainerStyle={{ flex: 1 }}
      >
        <TransactionForm
          initialData={editingTransaction || undefined}
          onSave={handleTransactionFormClose}
          onCancel={handleTransactionFormClose}
          isEdit={!!editingTransaction}
        />
      </Modal>

      {/* 거래 목록 모달 */}
      <Modal
        visible={showTransactionList}
        onDismiss={() => setShowTransactionList(false)}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.summaryHeader}>
            <Text variant="headlineSmall">
              {selectedDate.toLocaleDateString('ko-KR')} 거래 내역
            </Text>
            <IconButton 
              icon="close" 
              onPress={() => setShowTransactionList(false)} 
            />
          </View>
          <TransactionList
            filter={{
              dateRange: {
                start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
                end: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59),
              },
            }}
            onEdit={handleEditTransaction}
            onAdd={handleAddTransaction}
          />
        </View>
      </Modal>
    </View>
  );
}
