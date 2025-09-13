import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Card,
  Text,
  SegmentedButtons,
  FAB,
  Modal,
  IconButton,
  Chip,
} from 'react-native-paper';
import { useFinance } from '@/contexts/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { TransactionList } from '@/components/finance/TransactionList';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { TransactionFilter } from '@/components/finance/TransactionFilter';
import { CategoryManager } from '@/components/finance/CategoryManager';
import { BudgetManager } from '@/components/finance/BudgetManager';
import { FinanceReport } from '@/components/finance/FinanceReport';
import { FinanceCalendarView } from '@/components/finance/FinanceCalendarView';
import type { Transaction, TransactionFilter as FilterType } from '@/types/finance';

export function FinanceScreen() {
  const { colors, spacing } = useTheme();
  const { stats, filter, setFilter } = useFinance();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showTransactionFilter, setShowTransactionFilter] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);
  const [showFinanceReport, setShowFinanceReport] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

  const handleFilterApply = (newFilter: FilterType) => {
    setFilter(newFilter);
    setShowTransactionFilter(false);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const renderStats = () => (
    <Card style={styles.statsCard}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.statsTitle}>
          가계부 현황
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>이번 달 수입</Text>
            <Text variant="titleMedium" style={[styles.statValue, { color: colors.primary }]}>
              +{formatCurrency(stats.monthlyIncome)}원
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>이번 달 지출</Text>
            <Text variant="titleMedium" style={[styles.statValue, { color: colors.error }]}>
              -{formatCurrency(stats.monthlyExpense)}원
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>이번 달 순수익</Text>
            <Text 
              variant="titleLarge" 
              style={[
                styles.statValue, 
                { color: stats.monthlyNetIncome >= 0 ? colors.primary : colors.error }
              ]}
            >
              {stats.monthlyNetIncome >= 0 ? '+' : ''}{formatCurrency(stats.monthlyNetIncome)}원
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderQuickActions = () => (
    <Card style={styles.actionsCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.actionsTitle}>
          빠른 작업
        </Text>
        <View style={styles.actionsGrid}>
          <View style={styles.actionItem}>
            <IconButton
              icon="plus"
              mode="contained"
              onPress={handleAddTransaction}
              style={styles.actionButton}
            />
            <Text variant="bodySmall" style={styles.actionLabel}>거래 추가</Text>
          </View>
          <View style={styles.actionItem}>
            <IconButton
              icon="filter"
              mode="outlined"
              onPress={() => setShowTransactionFilter(true)}
              style={styles.actionButton}
            />
            <Text variant="bodySmall" style={styles.actionLabel}>필터</Text>
          </View>
          <View style={styles.actionItem}>
            <IconButton
              icon="tag"
              mode="outlined"
              onPress={() => setShowCategoryManager(true)}
              style={styles.actionButton}
            />
            <Text variant="bodySmall" style={styles.actionLabel}>카테고리</Text>
          </View>
          <View style={styles.actionItem}>
            <IconButton
              icon="wallet"
              mode="outlined"
              onPress={() => setShowBudgetManager(true)}
              style={styles.actionButton}
            />
            <Text variant="bodySmall" style={styles.actionLabel}>예산</Text>
          </View>
          <View style={styles.actionItem}>
            <IconButton
              icon="chart-line"
              mode="outlined"
              onPress={() => setShowFinanceReport(true)}
              style={styles.actionButton}
            />
            <Text variant="bodySmall" style={styles.actionLabel}>리포트</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderBudgetStatus = () => {
    if (stats.budgetStatus.length === 0) return null;

    return (
      <Card style={styles.budgetCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.budgetTitle}>
            예산 현황
          </Text>
          {stats.budgetStatus.slice(0, 3).map((budget) => (
            <View key={budget.budgetId} style={styles.budgetItem}>
              <View style={styles.budgetInfo}>
                <Text variant="bodyMedium">{budget.budgetName}</Text>
                <Text variant="bodySmall" style={styles.budgetAmount}>
                  {formatCurrency(budget.spent)}원 / {formatCurrency(budget.budgeted)}원
                </Text>
              </View>
              <Chip
                icon={budget.status === 'over' ? 'alert' : budget.status === 'at_limit' ? 'warning' : 'check'}
                style={[
                  styles.budgetChip,
                  {
                    backgroundColor: budget.status === 'over' ? colors.error + '20' :
                                    budget.status === 'at_limit' ? colors.warning + '20' :
                                    colors.primary + '20'
                  }
                ]}
                textStyle={{
                  color: budget.status === 'over' ? colors.error :
                         budget.status === 'at_limit' ? colors.warning :
                         colors.primary
                }}
                compact
              >
                {budget.percentage.toFixed(0)}%
              </Chip>
            </View>
          ))}
          {stats.budgetStatus.length > 3 && (
            <Text variant="bodySmall" style={styles.viewMoreText}>
              {stats.budgetStatus.length - 3}개 더 보기
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderViewModeSelector = () => (
    <View style={styles.viewModeContainer}>
      <SegmentedButtons
        value={viewMode}
        onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}
        buttons={[
          { value: 'list', label: '목록', icon: 'format-list-bulleted' },
          { value: 'calendar', label: '캘린더', icon: 'calendar' },
        ]}
        style={styles.segmentedButtons}
      />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    statsCard: {
      margin: spacing.md,
    },
    statsTitle: {
      marginBottom: spacing.md,
      fontWeight: '600',
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
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
    actionsCard: {
      margin: spacing.md,
    },
    actionsTitle: {
      marginBottom: spacing.md,
      fontWeight: '600',
    },
    actionsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    actionItem: {
      alignItems: 'center',
    },
    actionButton: {
      marginBottom: spacing.xs,
    },
    actionLabel: {
      textAlign: 'center',
      color: colors.onSurfaceVariant,
    },
    budgetCard: {
      margin: spacing.md,
    },
    budgetTitle: {
      marginBottom: spacing.md,
      fontWeight: '600',
    },
    budgetItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    budgetInfo: {
      flex: 1,
    },
    budgetAmount: {
      color: colors.onSurfaceVariant,
      marginTop: spacing.xs,
    },
    budgetChip: {
      marginLeft: spacing.sm,
    },
    viewMoreText: {
      textAlign: 'center',
      color: colors.primary,
      marginTop: spacing.sm,
    },
    viewModeContainer: {
      margin: spacing.md,
    },
    segmentedButtons: {
      marginBottom: spacing.md,
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderStats()}
        {renderQuickActions()}
        {renderBudgetStatus()}
        {renderViewModeSelector()}
      </ScrollView>

      {viewMode === 'list' ? (
        <TransactionList
          onEdit={handleEditTransaction}
          onAdd={handleAddTransaction}
          filter={filter}
        />
      ) : (
        <FinanceCalendarView onAddTransaction={handleAddTransaction} />
      )}

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

      {/* 필터 모달 */}
      <TransactionFilter
        visible={showTransactionFilter}
        onClose={() => setShowTransactionFilter(false)}
        onApply={handleFilterApply}
        initialFilter={filter}
      />

      {/* 카테고리 관리 모달 */}
      <CategoryManager
        visible={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />

      {/* 예산 관리 모달 */}
      <BudgetManager
        visible={showBudgetManager}
        onClose={() => setShowBudgetManager(false)}
      />

      {/* 리포트 모달 */}
      <FinanceReport
        visible={showFinanceReport}
        onClose={() => setShowFinanceReport(false)}
      />
    </View>
  );
}
