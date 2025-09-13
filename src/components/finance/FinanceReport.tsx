import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Card,
  Text,
  SegmentedButtons,
  ProgressBar,
  Chip,
  Button,
} from 'react-native-paper';
import { PieChart, BarChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFinance } from '@/contexts/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import type { FinancialReport, CategoryBreakdown, MonthlyTrend, BudgetStatus } from '@/types/finance';

interface FinanceReportProps {
  visible: boolean;
  onClose: () => void;
}

const screenWidth = Dimensions.get('window').width;

export function FinanceReport({ visible, onClose }: FinanceReportProps) {
  const { colors, spacing } = useTheme();
  const { generateReport, stats } = useFinance();

  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  useEffect(() => {
    if (visible) {
      loadReport();
    }
  }, [visible, period, dateRange]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const reportData = await generateReport(dateRange.start, dateRange.end);
      setReport(reportData);
    } catch (error) {
      console.error('리포트 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodDates = (period: 'week' | 'month' | 'year') => {
    const now = new Date();
    let start: Date, end: Date;

    switch (period) {
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        end = new Date(now);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now);
        break;
    }

    return { start, end };
  };

  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'year') => {
    setPeriod(newPeriod);
    const dates = getPeriodDates(newPeriod);
    setDateRange(dates);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const getCategoryChartData = (breakdown: CategoryBreakdown[]) => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
    ];

    return breakdown.map((item, index) => ({
      name: item.categoryName,
      population: item.amount,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  };

  const getMonthlyChartData = (trend: MonthlyTrend[]) => {
    return {
      labels: trend.map(item => item.month.split('-')[1] + '월'),
      datasets: [
        {
          data: trend.map(item => item.income),
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: trend.map(item => item.expense),
          color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const renderSummary = () => {
    if (!report) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            요약
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>총 수입</Text>
              <Text variant="titleMedium" style={[styles.summaryValue, { color: colors.primary }]}>
                +{formatCurrency(report.totalIncome)}원
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>총 지출</Text>
              <Text variant="titleMedium" style={[styles.summaryValue, { color: colors.error }]}>
                -{formatCurrency(report.totalExpense)}원
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>순수익</Text>
              <Text 
                variant="titleLarge" 
                style={[
                  styles.summaryValue, 
                  { color: report.netIncome >= 0 ? colors.primary : colors.error }
                ]}
              >
                {report.netIncome >= 0 ? '+' : ''}{formatCurrency(report.netIncome)}원
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderCategoryBreakdown = () => {
    if (!report || report.categoryBreakdown.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            카테고리별 지출
          </Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={getCategoryChartData(report.categoryBreakdown)}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
            />
          </View>
          <View style={styles.categoryList}>
            {report.categoryBreakdown.map((item, index) => (
              <View key={item.categoryId} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryColor, { backgroundColor: chartConfig.color(0.8) }]} />
                  <Text variant="bodyMedium">{item.categoryName}</Text>
                </View>
                <View style={styles.categoryAmount}>
                  <Text variant="bodyMedium">{formatCurrency(item.amount)}원</Text>
                  <Text variant="bodySmall" style={styles.percentage}>
                    {item.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderMonthlyTrend = () => {
    if (!report || report.monthlyTrend.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            월별 트렌드
          </Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={getMonthlyChartData(report.monthlyTrend)}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderBudgetStatus = () => {
    if (!report || report.budgetStatus.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            예산 현황
          </Text>
          {report.budgetStatus.map((budget) => (
            <View key={budget.budgetId} style={styles.budgetItem}>
              <View style={styles.budgetHeader}>
                <Text variant="bodyMedium">{budget.budgetName}</Text>
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
                  {budget.status === 'over' ? '초과' : 
                   budget.status === 'at_limit' ? '경고' : '정상'}
                </Chip>
              </View>
              <View style={styles.budgetProgress}>
                <ProgressBar
                  progress={Math.min(budget.percentage / 100, 1)}
                  color={budget.status === 'over' ? colors.error : 
                         budget.status === 'at_limit' ? colors.warning : colors.primary}
                  style={styles.progressBar}
                />
                <Text variant="bodySmall" style={styles.progressText}>
                  {budget.spent.toLocaleString('ko-KR')}원 / {budget.budgeted.toLocaleString('ko-KR')}원
                  ({budget.percentage.toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderTopExpenses = () => {
    if (!report || report.topExpenses.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            주요 지출
          </Text>
          {report.topExpenses.map((expense, index) => (
            <View key={expense.id} style={styles.expenseItem}>
              <Text variant="bodyMedium" style={styles.expenseRank}>
                {index + 1}
              </Text>
              <View style={styles.expenseInfo}>
                <Text variant="bodyMedium">{expense.description}</Text>
                <Text variant="bodySmall" style={styles.expenseDate}>
                  {expense.date.toLocaleDateString('ko-KR')}
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.expenseAmount}>
                -{formatCurrency(expense.amount)}원
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    scrollView: {
      flex: 1,
    },
    card: {
      margin: spacing.md,
    },
    cardTitle: {
      marginBottom: spacing.md,
      fontWeight: '600',
    },
    summaryGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryLabel: {
      color: colors.onSurfaceVariant,
      marginBottom: spacing.xs,
    },
    summaryValue: {
      fontWeight: 'bold',
    },
    chartContainer: {
      alignItems: 'center',
      marginVertical: spacing.md,
    },
    chart: {
      marginVertical: 8,
      borderRadius: 16,
    },
    categoryList: {
      marginTop: spacing.md,
    },
    categoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: spacing.sm,
    },
    categoryAmount: {
      alignItems: 'flex-end',
    },
    percentage: {
      color: colors.onSurfaceVariant,
    },
    budgetItem: {
      marginBottom: spacing.md,
    },
    budgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    budgetChip: {
      marginLeft: spacing.sm,
    },
    budgetProgress: {
      marginTop: spacing.xs,
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      marginBottom: spacing.xs,
    },
    progressText: {
      textAlign: 'right',
      color: colors.onSurfaceVariant,
    },
    expenseItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    expenseRank: {
      width: 24,
      textAlign: 'center',
      fontWeight: 'bold',
      color: colors.primary,
    },
    expenseInfo: {
      flex: 1,
      marginLeft: spacing.sm,
    },
    expenseDate: {
      color: colors.onSurfaceVariant,
      marginTop: spacing.xs,
    },
    expenseAmount: {
      fontWeight: 'bold',
      color: colors.error,
    },
    periodSelector: {
      margin: spacing.md,
    },
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    dateButton: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">가계부 리포트</Text>
        <Button mode="outlined" onPress={onClose}>
          닫기
        </Button>
      </View>

      <View style={styles.periodSelector}>
        <SegmentedButtons
          value={period}
          onValueChange={handlePeriodChange}
          buttons={[
            { value: 'week', label: '주간', icon: 'calendar-week' },
            { value: 'month', label: '월간', icon: 'calendar-month' },
            { value: 'year', label: '연간', icon: 'calendar' },
          ]}
        />
        <View style={styles.dateRow}>
          <Button
            mode="outlined"
            onPress={() => setShowStartDatePicker(true)}
            style={styles.dateButton}
          >
            {dateRange.start.toLocaleDateString('ko-KR')}
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowEndDatePicker(true)}
            style={styles.dateButton}
          >
            {dateRange.end.toLocaleDateString('ko-KR')}
          </Button>
        </View>
        {showStartDatePicker && (
          <DateTimePicker
            value={dateRange.start}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setDateRange(prev => ({ ...prev, start: selectedDate }));
              }
            }}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={dateRange.end}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setDateRange(prev => ({ ...prev, end: selectedDate }));
              }
            }}
          />
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSummary()}
        {renderCategoryBreakdown()}
        {renderMonthlyTrend()}
        {renderBudgetStatus()}
        {renderTopExpenses()}
      </ScrollView>
    </View>
  );
}
