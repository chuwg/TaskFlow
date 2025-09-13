import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Checkbox, Chip, IconButton, Menu } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { Card } from '@/components/shared/Card';
import { Text } from '@/components/typography/Text';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Todo, TodoStatus, TodoPriority } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
}) => {
  const { theme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const getStatusText = (status: TodoStatus) => {
    switch (status) {
      case 'pending':
        return '대기';
      case 'in_progress':
        return '진행중';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: TodoPriority) => {
    switch (priority) {
      case 'urgent':
        return '긴급';
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case 'urgent':
        return theme.colors.error;
      case 'high':
        return '#FF9800';
      case 'medium':
        return theme.colors.primary;
      case 'low':
        return theme.colors.outline;
      default:
        return theme.colors.outline;
    }
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.status === 'completed' || todo.status === 'cancelled') {
      return false;
    }
    return todo.dueDate < new Date();
  };

  const handleDelete = () => {
    Alert.alert(
      '할일 삭제',
      '이 할일을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => onDelete(todo.id) },
      ]
    );
  };

  const handleToggleStatus = () => {
    onToggleStatus(todo.id);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit(todo);
  };

  const handleDuplicate = () => {
    setMenuVisible(false);
    onDuplicate(todo.id);
  };

  return (
    <Card style={[
      styles.container,
      { backgroundColor: theme.colors.surface },
      isOverdue() && { borderLeftWidth: 4, borderLeftColor: theme.colors.error },
    ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Checkbox
              status={todo.status === 'completed' ? 'checked' : 'unchecked'}
              onPress={handleToggleStatus}
              color={theme.colors.primary}
            />
            <Text
              variant="titleMedium"
              style={[
                styles.title,
                { color: theme.colors.onSurface },
                todo.status === 'completed' && styles.completedTitle,
              ]}
            >
              {todo.title}
            </Text>
          </View>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
                iconColor={theme.colors.onSurfaceVariant}
              />
            }
          >
            <Menu.Item onPress={handleEdit} title="편집" leadingIcon="pencil" />
            <Menu.Item onPress={handleDuplicate} title="복사" leadingIcon="content-copy" />
            <Menu.Item onPress={handleDelete} title="삭제" leadingIcon="delete" />
          </Menu>
        </View>

        {todo.description && (
          <Text
            variant="bodyMedium"
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
              todo.status === 'completed' && styles.completedText,
            ]}
          >
            {todo.description}
          </Text>
        )}

        <View style={styles.metadata}>
          <View style={styles.chips}>
            <Chip
              mode="outlined"
              compact
              style={[styles.chip, { backgroundColor: getPriorityColor(todo.priority) + '20' }]}
              textStyle={{ color: getPriorityColor(todo.priority) }}
            >
              {getPriorityText(todo.priority)}
            </Chip>
            <Chip
              mode="outlined"
              compact
              style={[styles.chip, { backgroundColor: theme.colors.primary + '20' }]}
              textStyle={{ color: theme.colors.primary }}
            >
              {getStatusText(todo.status)}
            </Chip>
            {todo.category !== 'other' && (
              <Chip
                mode="outlined"
                compact
                style={[styles.chip, { backgroundColor: theme.colors.secondary + '20' }]}
                textStyle={{ color: theme.colors.secondary }}
              >
                {todo.category}
              </Chip>
            )}
          </View>

          {todo.dueDate && (
            <Text
              variant="bodySmall"
              style={[
                styles.dueDate,
                { color: isOverdue() ? theme.colors.error : theme.colors.onSurfaceVariant },
              ]}
            >
              {isOverdue() ? '⚠️ ' : '📅 '}
              {format(todo.dueDate, 'MM월 dd일 HH:mm', { locale: ko })}
            </Text>
          )}

          {todo.tags.length > 0 && (
            <View style={styles.tags}>
              {todo.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  compact
                  style={[styles.tagChip, { backgroundColor: theme.colors.outline + '20' }]}
                  textStyle={{ color: theme.colors.onSurfaceVariant }}
                >
                  #{tag}
                </Chip>
              ))}
              {todo.tags.length > 3 && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  +{todo.tags.length - 3}
                </Text>
              )}
            </View>
          )}

          {todo.estimatedTime && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              ⏱️ 예상 {todo.estimatedTime}분
            </Text>
          )}

          {todo.location && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              📍 {todo.location}
            </Text>
          )}
        </View>

        {todo.subtasks && todo.subtasks.length > 0 && (
          <View style={styles.subtasks}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              하위 할일: {todo.subtasks.filter(st => st.status === 'completed').length}/{todo.subtasks.length}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    flex: 1,
    marginLeft: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    marginLeft: 40,
    marginBottom: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  metadata: {
    marginLeft: 40,
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    marginRight: 4,
  },
  dueDate: {
    fontWeight: '500',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  tagChip: {
    marginRight: 4,
  },
  subtasks: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});
