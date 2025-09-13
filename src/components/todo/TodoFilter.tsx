import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Dialog, Button, Chip, SegmentedButtons } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/typography/Text';
import { Button as CustomButton } from '@/components/shared/Button';
import type { TodoFilter, TodoStatus, TodoPriority, TodoCategory } from '@/types/todo';

interface TodoFilterProps {
  filter: TodoFilter;
  onFilterChange: (filter: Partial<TodoFilter>) => void;
  onClose: () => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  onFilterChange,
  onClose,
}) => {
  const { theme } = useTheme();
  const [localFilter, setLocalFilter] = useState<TodoFilter>({ ...filter });

  const statusOptions = [
    { value: 'pending', label: '대기' },
    { value: 'in_progress', label: '진행중' },
    { value: 'completed', label: '완료' },
    { value: 'cancelled', label: '취소' },
  ];

  const priorityOptions = [
    { value: 'low', label: '낮음' },
    { value: 'medium', label: '보통' },
    { value: 'high', label: '높음' },
    { value: 'urgent', label: '긴급' },
  ];

  const categoryOptions = [
    { value: 'work', label: '업무' },
    { value: 'personal', label: '개인' },
    { value: 'health', label: '건강' },
    { value: 'shopping', label: '쇼핑' },
    { value: 'study', label: '학습' },
    { value: 'other', label: '기타' },
  ];

  const handleStatusChange = (status: TodoStatus) => {
    const currentStatuses = localFilter.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    setLocalFilter(prev => ({
      ...prev,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    }));
  };

  const handlePriorityChange = (priority: TodoPriority) => {
    const currentPriorities = localFilter.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    setLocalFilter(prev => ({
      ...prev,
      priority: newPriorities.length > 0 ? newPriorities : undefined,
    }));
  };

  const handleCategoryChange = (category: TodoCategory) => {
    const currentCategories = localFilter.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    setLocalFilter(prev => ({
      ...prev,
      category: newCategories.length > 0 ? newCategories : undefined,
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilter);
    onClose();
  };

  const handleClear = () => {
    setLocalFilter({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(localFilter).some(key => {
    const value = localFilter[key as keyof TodoFilter];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  return (
    <Dialog.Content style={{ backgroundColor: theme.colors.background }}>
      <ScrollView style={styles.container}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, marginBottom: 16 }}>
          필터 설정
        </Text>

        {/* 상태 필터 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
            상태
          </Text>
          <View style={styles.chipContainer}>
            {statusOptions.map((option) => (
              <Chip
                key={option.value}
                selected={localFilter.status?.includes(option.value as TodoStatus) || false}
                onPress={() => handleStatusChange(option.value as TodoStatus)}
                style={styles.chip}
              >
                {option.label}
              </Chip>
            ))}
          </View>
        </View>

        {/* 우선순위 필터 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
            우선순위
          </Text>
          <View style={styles.chipContainer}>
            {priorityOptions.map((option) => (
              <Chip
                key={option.value}
                selected={localFilter.priority?.includes(option.value as TodoPriority) || false}
                onPress={() => handlePriorityChange(option.value as TodoPriority)}
                style={styles.chip}
              >
                {option.label}
              </Chip>
            ))}
          </View>
        </View>

        {/* 카테고리 필터 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
            카테고리
          </Text>
          <View style={styles.chipContainer}>
            {categoryOptions.map((option) => (
              <Chip
                key={option.value}
                selected={localFilter.category?.includes(option.value as TodoCategory) || false}
                onPress={() => handleCategoryChange(option.value as TodoCategory)}
                style={styles.chip}
              >
                {option.label}
              </Chip>
            ))}
          </View>
        </View>

        {/* 기타 옵션 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
            기타 옵션
          </Text>
          <Chip
            selected={localFilter.isOverdue || false}
            onPress={() => setLocalFilter(prev => ({ 
              ...prev, 
              isOverdue: !prev.isOverdue 
            }))}
            style={styles.chip}
            icon="alert"
          >
            마감일 지난 할일만
          </Chip>
        </View>
      </ScrollView>

      <Dialog.Actions>
        <CustomButton mode="outlined" onPress={handleClear}>
          초기화
        </CustomButton>
        <CustomButton mode="outlined" onPress={onClose}>
          취소
        </CustomButton>
        <CustomButton mode="contained" onPress={handleApply}>
          적용
        </CustomButton>
      </Dialog.Actions>
    </Dialog.Content>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
  },
  section: {
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
});
