import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Portal, FAB, Dialog, Searchbar, Chip, Menu, Button } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { useTodoContext } from '@/contexts/TodoContext';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/shared/Card';
import { Button as CustomButton } from '@/components/shared/Button';
import { TodoList } from '@/components/todo/TodoList';
import { TodoForm } from '@/components/todo/TodoForm';
import { TodoFilter } from '@/components/todo/TodoFilter';
import { TodoStatsComponent } from '@/components/todo/TodoStats';
import type { Todo, TodoStatus, TodoPriority, TodoCategory } from '@/types/todo';

export const TodoScreen = () => {
  const { theme } = useTheme();
  const {
    state,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    duplicateTodo,
    setFilter,
    setSortOption,
    clearFilter,
    getOverdueTodos,
    clearError,
  } = useTodoContext();

  const { todos, loading, error, stats, filter, sortOption } = state;

  const [isAddTodoVisible, setIsAddTodoVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  // Filter and sort todos
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        todo.description?.toLowerCase().includes(query) ||
        todo.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(todo => filter.status!.includes(todo.status));
    }

    // Apply priority filter
    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter(todo => filter.priority!.includes(todo.priority));
    }

    // Apply category filter
    if (filter.category && filter.category.length > 0) {
      filtered = filtered.filter(todo => filter.category!.includes(todo.category));
    }

    // Apply tags filter
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(todo =>
        filter.tags!.some(tag => todo.tags.includes(tag))
      );
    }

    // Apply due date range filter
    if (filter.dueDateRange) {
      filtered = filtered.filter(todo => {
        if (!todo.dueDate) return false;
        return todo.dueDate >= filter.dueDateRange!.start &&
               todo.dueDate <= filter.dueDateRange!.end;
      });
    }

    // Apply overdue filter
    if (filter.isOverdue) {
      const now = new Date();
      filtered = filtered.filter(todo => {
        if (!todo.dueDate || todo.status === 'completed' || todo.status === 'cancelled') {
          return false;
        }
        return todo.dueDate < now;
      });
    }

    // Sort todos
    filtered.sort((a, b) => {
      const field = sortOption.field;
      const direction = sortOption.direction;

      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate?.getTime() || 0;
          bValue = b.dueDate?.getTime() || 0;
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
      }

      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [todos, searchQuery, filter, sortOption]);

  const handleAddTodo = async (todoData: Partial<Todo>) => {
    try {
      const newTodoData = {
        title: todoData.title || '',
        description: todoData.description || '',
        status: (todoData.status as TodoStatus) || 'pending',
        priority: (todoData.priority as TodoPriority) || 'medium',
        category: (todoData.category as TodoCategory) || 'other',
        dueDate: todoData.dueDate,
        estimatedTime: todoData.estimatedTime,
        tags: todoData.tags || [],
        location: todoData.location,
        notes: todoData.notes,
        color: todoData.color,
      };

      await addTodo(newTodoData);
      setIsAddTodoVisible(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsAddTodoVisible(true);
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleTodoStatus(id);
    } catch (error) {
      console.error('Failed to toggle todo status:', error);
    }
  };

  const handleDuplicateTodo = async (id: string) => {
    try {
      await duplicateTodo(id);
    } catch (error) {
      console.error('Failed to duplicate todo:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh logic would go here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusChipColor = (status: TodoStatus) => {
    switch (status) {
      case 'pending':
        return theme.colors.outline;
      case 'in_progress':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.primary;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getPriorityChipColor = (priority: TodoPriority) => {
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

  const hasActiveFilters = Object.keys(filter).length > 0 || searchQuery.trim() !== '';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
          할일 관리
        </Text>
        <View style={styles.headerActions}>
          <Button
            mode="outlined"
            onPress={() => setIsFilterVisible(true)}
            icon="filter"
            compact
          >
            필터
          </Button>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setSortMenuVisible(true)}
                icon="sort"
                compact
              >
                정렬
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setSortOption({ field: 'createdAt', direction: 'desc' });
                setSortMenuVisible(false);
              }}
              title="최신순"
            />
            <Menu.Item
              onPress={() => {
                setSortOption({ field: 'dueDate', direction: 'asc' });
                setSortMenuVisible(false);
              }}
              title="마감일순"
            />
            <Menu.Item
              onPress={() => {
                setSortOption({ field: 'priority', direction: 'desc' });
                setSortMenuVisible(false);
              }}
              title="우선순위순"
            />
            <Menu.Item
              onPress={() => {
                setSortOption({ field: 'title', direction: 'asc' });
                setSortMenuVisible(false);
              }}
              title="제목순"
            />
          </Menu>
        </View>
      </View>

      {/* Search */}
      <Searchbar
        placeholder="할일 검색..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
      />

      {/* Stats */}
      <TodoStatsComponent stats={stats} />

      {/* Active Filters */}
      {hasActiveFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchQuery.trim() !== '' && (
              <Chip
                icon="close"
                onPress={() => setSearchQuery('')}
                style={styles.filterChip}
              >
                검색: {searchQuery}
              </Chip>
            )}
            {filter.status && filter.status.length > 0 && (
              <Chip
                icon="close"
                onPress={() => setFilter({ status: undefined })}
                style={styles.filterChip}
              >
                상태: {filter.status.join(', ')}
              </Chip>
            )}
            {filter.priority && filter.priority.length > 0 && (
              <Chip
                icon="close"
                onPress={() => setFilter({ priority: undefined })}
                style={styles.filterChip}
              >
                우선순위: {filter.priority.join(', ')}
              </Chip>
            )}
            <Chip
              icon="close"
              onPress={clearFilter}
              style={styles.filterChip}
            >
              모든 필터 지우기
            </Chip>
          </ScrollView>
        </View>
      )}

      {/* Todo List */}
      <ScrollView
        style={styles.todoList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredTodos.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              {hasActiveFilters ? '필터 조건에 맞는 할일이 없습니다.' : '할일이 없습니다.'}
            </Text>
            <CustomButton
              mode="outlined"
              onPress={() => setIsAddTodoVisible(true)}
              style={styles.addButton}
            >
              첫 번째 할일 추가하기
            </CustomButton>
          </Card>
        ) : (
          <TodoList
            todos={filteredTodos}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
            onToggleStatus={handleToggleStatus}
            onDuplicate={handleDuplicateTodo}
          />
        )}
      </ScrollView>

      {/* Add Todo FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          setSelectedTodo(null);
          setIsAddTodoVisible(true);
        }}
      />

      {/* Dialogs */}
      <Portal>
        {/* Todo Form Dialog */}
        <Dialog
          visible={isAddTodoVisible}
          onDismiss={() => {
            setIsAddTodoVisible(false);
            setSelectedTodo(null);
          }}
          style={{ backgroundColor: theme.colors.background }}
        >
          <TodoForm
            todo={selectedTodo || undefined}
            onSubmit={handleAddTodo}
            onCancel={() => {
              setIsAddTodoVisible(false);
              setSelectedTodo(null);
            }}
          />
        </Dialog>

        {/* Filter Dialog */}
        <Dialog
          visible={isFilterVisible}
          onDismiss={() => setIsFilterVisible(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <TodoFilter
            filter={filter}
            onFilterChange={setFilter}
            onClose={() => setIsFilterVisible(false)}
          />
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterChip: {
    marginRight: 8,
  },
  todoList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  addButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
