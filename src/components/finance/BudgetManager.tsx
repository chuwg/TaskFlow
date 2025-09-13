import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import {
  Card,
  Text,
  Chip,
  IconButton,
  FAB,
  Button,
  TextInput,
  SegmentedButtons,
  ProgressBar,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFinance } from '@/contexts/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import type { Budget } from '@/types/finance';

interface BudgetManagerProps {
  visible: boolean;
  onClose: () => void;
}

export function BudgetManager({ visible, onClose }: BudgetManagerProps) {
  const { colors, spacing } = useTheme();
  const { 
    budgets, 
    categories,
    addBudget, 
    updateBudget, 
    deleteBudget,
    loading 
  } = useFinance();

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    amount: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
    alertThreshold: 90,
  });

  const handleAdd = () => {
    setEditingBudget(null);
    setFormData({
      name: '',
      categoryId: '',
      amount: '',
      period: 'monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      alertThreshold: 90,
    });
    setShowForm(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: budget.alertThreshold,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('오류', '예산 이름을 입력해주세요.');
      return;
    }

    if (!formData.categoryId) {
      Alert.alert('오류', '카테고리를 선택해주세요.');
      return;
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      Alert.alert('오류', '올바른 금액을 입력해주세요.');
      return;
    }

    try {
      const budgetData = {
        ...formData,
        amount: Number(formData.amount),
        spent: editingBudget?.spent || 0,
        remaining: Number(formData.amount) - (editingBudget?.spent || 0),
        isActive: true,
      };

      if (editingBudget) {
        await updateBudget(editingBudget.id, budgetData);
      } else {
        await addBudget(budgetData);
      }
      setShowForm(false);
      setEditingBudget(null);
    } catch (error) {
      Alert.alert('오류', '예산을 저장하는 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = (budget: Budget) => {
    Alert.alert(
      '예산 삭제',
      `'${budget.name}' 예산을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBudget(budget.id);
            } catch (error) {
              Alert.alert('오류', '예산을 삭제하는 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '알 수 없는 카테고리';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || colors.primary;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return colors.error;
    if (percentage >= 90) return colors.warning || '#FF9800';
    return colors.primary;
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return '초과';
    if (percentage >= 90) return '경고';
    return '정상';
  };

  const renderBudget = ({ item }: { item: Budget }) => {
    const percentage = item.amount > 0 ? (item.spent / item.amount) * 100 : 0;
    const statusColor = getStatusColor(percentage);
    const statusText = getStatusText(percentage);

    return (
      <Card style={styles.budgetCard}>
        <Card.Content>
          <View style={styles.budgetHeader}>
            <View style={styles.budgetInfo}>
              <Text variant="titleMedium">{item.name}</Text>
              <Chip
                icon="tag"
                style={[styles.categoryChip, { backgroundColor: getCategoryColor(item.categoryId) + '20' }]}
                textStyle={{ color: getCategoryColor(item.categoryId) }}
                compact
              >
                {getCategoryName(item.categoryId)}
              </Chip>
            </View>
            <View style={styles.budgetActions}>
              <IconButton
                icon="pencil"
                onPress={() => handleEdit(item)}
              />
              <IconButton
                icon="delete"
                onPress={() => handleDelete(item)}
              />
            </View>
          </View>

          <View style={styles.budgetAmounts}>
            <View style={styles.amountRow}>
              <Text variant="bodyMedium">사용: </Text>
              <Text variant="bodyMedium" style={{ color: statusColor }}>
                {item.spent.toLocaleString('ko-KR')}원
              </Text>
            </View>
            <View style={styles.amountRow}>
              <Text variant="bodyMedium">예산: </Text>
              <Text variant="bodyMedium">{item.amount.toLocaleString('ko-KR')}원</Text>
            </View>
            <View style={styles.amountRow}>
              <Text variant="bodyMedium">남은 금액: </Text>
              <Text variant="bodyMedium" style={{ color: statusColor }}>
                {item.remaining.toLocaleString('ko-KR')}원
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text variant="bodySmall">사용률</Text>
              <Text variant="bodySmall" style={{ color: statusColor }}>
                {percentage.toFixed(1)}% ({statusText})
              </Text>
            </View>
            <ProgressBar
              progress={Math.min(percentage / 100, 1)}
              color={statusColor}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.budgetPeriod}>
            <Text variant="bodySmall" style={styles.periodText}>
              {item.startDate.toLocaleDateString('ko-KR')} ~ {item.endDate.toLocaleDateString('ko-KR')}
            </Text>
            <Chip
              icon="calendar"
              style={styles.periodChip}
              compact
            >
              {item.period === 'weekly' ? '주간' : item.period === 'monthly' ? '월간' : '연간'}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderForm = () => (
    <Modal visible={showForm} animationType="slide">
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text variant="headlineSmall">
            {editingBudget ? '예산 수정' : '새 예산'}
          </Text>
          <IconButton icon="close" onPress={() => setShowForm(false)} />
        </View>

        <View style={styles.formContent}>
          <TextInput
            label="예산 이름"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="카테고리"
            value={getCategoryName(formData.categoryId)}
            onPressIn={() => {
              // 카테고리 선택 모달 표시
            }}
            style={styles.input}
            mode="outlined"
            right={<TextInput.Icon icon="chevron-down" />}
            editable={false}
          />

          <TextInput
            label="예산 금액"
            value={formData.amount}
            onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>예산 기간</Text>
            <SegmentedButtons
              value={formData.period}
              onValueChange={(value) => setFormData(prev => ({ ...prev, period: value as any }))}
              buttons={[
                { value: 'weekly', label: '주간', icon: 'calendar-week' },
                { value: 'monthly', label: '월간', icon: 'calendar-month' },
                { value: 'yearly', label: '연간', icon: 'calendar' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>기간 설정</Text>
            <View style={styles.dateRow}>
              <TextInput
                label="시작 날짜"
                value={formData.startDate.toLocaleDateString('ko-KR')}
                onPressIn={() => setShowStartDatePicker(true)}
                style={styles.dateInput}
                mode="outlined"
                right={<TextInput.Icon icon="calendar" />}
                editable={false}
              />
              <TextInput
                label="종료 날짜"
                value={formData.endDate.toLocaleDateString('ko-KR')}
                onPressIn={() => setShowEndDatePicker(true)}
                style={styles.dateInput}
                mode="outlined"
                right={<TextInput.Icon icon="calendar" />}
                editable={false}
              />
            </View>
            {showStartDatePicker && (
              <DateTimePicker
                value={formData.startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) {
                    setFormData(prev => ({ ...prev, startDate: selectedDate }));
                  }
                }}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={formData.endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) {
                    setFormData(prev => ({ ...prev, endDate: selectedDate }));
                  }
                }}
              />
            )}
          </View>

          <TextInput
            label="알림 임계값 (%)"
            value={formData.alertThreshold.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, alertThreshold: Number(text) || 90 }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formActions}>
          <Button
            mode="outlined"
            onPress={() => setShowForm(false)}
            style={styles.button}
          >
            취소
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            loading={loading}
          >
            {editingBudget ? '수정' : '추가'}
          </Button>
        </View>
      </View>
    </Modal>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    budgetCard: {
      marginHorizontal: spacing.md,
      marginVertical: spacing.xs,
    },
    budgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    budgetInfo: {
      flex: 1,
    },
    categoryChip: {
      marginTop: spacing.xs,
    },
    budgetActions: {
      flexDirection: 'row',
    },
    budgetAmounts: {
      marginBottom: spacing.sm,
    },
    amountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    progressContainer: {
      marginBottom: spacing.sm,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
    },
    budgetPeriod: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    periodText: {
      color: colors.onSurfaceVariant,
      flex: 1,
    },
    periodChip: {
      marginLeft: spacing.sm,
    },
    formContainer: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    formHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    formContent: {
      flex: 1,
      padding: spacing.md,
    },
    input: {
      marginBottom: spacing.md,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: spacing.sm,
      color: colors.onSurface,
    },
    segmentedButtons: {
      marginBottom: spacing.md,
    },
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateInput: {
      flex: 1,
      marginRight: spacing.sm,
    },
    formActions: {
      flexDirection: 'row',
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.outline,
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    fab: {
      position: 'absolute',
      margin: spacing.md,
      right: 0,
      bottom: 0,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.onSurfaceVariant,
      marginTop: spacing.md,
    },
  });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.formHeader}>
          <Text variant="headlineSmall">예산 관리</Text>
          <IconButton icon="close" onPress={onClose} />
        </View>

        {budgets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="headlineSmall" style={styles.emptyText}>
              예산이 없습니다
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              새로운 예산을 추가해보세요
            </Text>
          </View>
        ) : (
          <FlatList
            data={budgets}
            keyExtractor={(item) => item.id}
            renderItem={renderBudget}
            showsVerticalScrollIndicator={false}
          />
        )}

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleAdd}
        />
      </View>

      {renderForm()}
    </Modal>
  );
}
