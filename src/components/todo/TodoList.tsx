import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Card } from '@/components/shared/Card';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/shared/Button';
import { TodoItem } from './TodoItem.js';
import type { Todo } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
}) => {
  const { theme } = useTheme();

  if (todos.length === 0) {
    return (
      <Card style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
          할일이 없습니다
        </Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onDuplicate={onDuplicate}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
