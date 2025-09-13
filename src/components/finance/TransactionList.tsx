import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Text, Chip, IconButton, Menu, FAB } from 'react-native-paper';
import { useFinance } from '@/contexts/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import type { Transaction, TransactionFilter, TransactionSortOption } from '@/types/finance';

interface TransactionListProps {
  onEdit?: (transaction: Transaction) => void;
  onAdd?: () => void;
  filter?: TransactionFilter;
  sortOption?: TransactionSortOption;
}

export function TransactionList({ 
  onEdit, 
  onAdd, 
  filter = {},
  sortOption = { field: 'date', direction: 'desc' }
}: TransactionListProps) {
  const { colors, spacing } = useTheme();
  const { 
    transactions, 
    categories, 
    accounts,
    loading,
    deleteTransaction,
    setFilter,
    setSortOption
  } = useFinance();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // 필터링 및 정렬된 거래 목록
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // 필터 적용
    if (filter.type && filter.type.length > 0) {
      filtered = filtered.filter(t => filter.type!.includes(t.type));
    }
    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(t => filter.status!.includes(t.status));
    }
    if (filter.category && filter.category.length > 0) {
      filtered = filtered.filter(t => filter.category!.includes(t.category));
    }
    if (filter.paymentMethod && filter.paymentMethod.length > 0) {
      filtered = filtered.filter(t => filter.paymentMethod!.includes(t.paymentMethod));
    }
    if (filter.accountId && filter.accountId.length > 0) {
      filtered = filtered.filter(t => filter.accountId!.includes(t.accountId || ''));
    }
    if (filter.amountRange) {
      filtered = filtered.filter(t => 
        t.amount >= filter.amountRange!.min && t.amount <= filter.amountRange!.max
      );
    }
    if (filter.dateRange) {
      filtered = filtered.filter(t => 
        t.date >= filter.dateRange!.start && t.date <= filter.dateRange!.end
      );
    }
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(t => 
        filter.tags!.some(tag => t.tags.includes(tag))
      );
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(query) ||
        t.merchant?.toLowerCase().includes(query) ||
        t.location?.toLowerCase().includes(query)
      );
    }

    // 정렬 적용
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOption.field) {
        case 'date':
          aValue = a.date.getTime();
          bValue = b.date.getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          const aCategory = categories.find(c => c.id === a.category);
          const bCategory = categories.find(c => c.id === b.category);
          aValue = aCategory?.name || '';
          bValue = bCategory?.name || '';
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOption.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOption.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, categories, filter, sortOption]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 실제로는 데이터를 다시 로드하는 로직이 필요
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDelete = async (transaction: Transaction) => {
    Alert.alert(
      '거래 삭제',
      '이 거래를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
            } catch (error) {
              Alert.alert('오류', '거래를 삭제하는 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const getAccountInfo = (accountId?: string) => {
    if (!accountId) return null;
    return accounts.find(a => a.id === accountId);
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = amount.toLocaleString('ko-KR');
    return type === 'expense' ? `-${formatted}` : `+${formatted}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return colors.primary;
      case 'expense': return colors.error;
      case 'transfer': return colors.secondary;
      default: return colors.onSurface;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income': return 'plus';
      case 'expense': return 'minus';
      case 'transfer': return 'swap-horizontal';
      default: return 'circle';
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const category = getCategoryInfo(item.category);
    const account = getAccountInfo(item.accountId);
    
    return (
      <Card style={styles.transactionCard}>
        <Card.Content>
          <View style={styles.transactionHeader}>
            <View style={styles.transactionInfo}>
              <View style={styles.transactionTitle}>
                <Text variant="titleMedium" style={styles.description}>
                  {item.description}
                </Text>
                <Text 
                  variant="titleLarge" 
                  style={[
                    styles.amount,
                    { color: getTypeColor(item.type) }
                  ]}
                >
                  {formatAmount(item.amount, item.type)}원
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Chip
                  icon={category?.icon || 'tag'}
                  style={[styles.categoryChip, { backgroundColor: category?.color + '20' }]}
                  textStyle={{ color: category?.color }}
                >
                  {category?.name || '카테고리 없음'}
                </Chip>
                <Text variant="bodySmall" style={styles.date}>
                  {item.date.toLocaleDateString('ko-KR')}
                </Text>
              </View>
            </View>
            <Menu
              visible={menuVisible && selectedTransaction?.id === item.id}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => {
                    setSelectedTransaction(item);
                    setMenuVisible(true);
                  }}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onEdit?.(item);
                }}
                title="수정"
                leadingIcon="pencil"
              />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  handleDelete(item);
                }}
                title="삭제"
                leadingIcon="delete"
              />
            </Menu>
          </View>
          
          {item.merchant && (
            <Text variant="bodySmall" style={styles.merchant}>
              {item.merchant}
            </Text>
          )}
          
          {item.location && (
            <Text variant="bodySmall" style={styles.location}>
              📍 {item.location}
            </Text>
          )}
          
          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <Chip key={index} style={styles.tag} compact>
                  {tag}
                </Chip>
              ))}
            </View>
          )}
          
          {account && (
            <Text variant="bodySmall" style={styles.account}>
              💳 {account.name}
            </Text>
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
    transactionCard: {
      marginHorizontal: spacing.md,
      marginVertical: spacing.xs,
    },
    transactionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    transactionInfo: {
      flex: 1,
    },
    transactionTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    description: {
      flex: 1,
      marginRight: spacing.sm,
    },
    amount: {
      fontWeight: 'bold',
    },
    transactionDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    categoryChip: {
      marginRight: spacing.sm,
    },
    date: {
      color: colors.onSurfaceVariant,
    },
    merchant: {
      color: colors.onSurfaceVariant,
      marginTop: spacing.xs,
    },
    location: {
      color: colors.onSurfaceVariant,
      marginTop: spacing.xs,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.sm,
    },
    tag: {
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    account: {
      color: colors.onSurfaceVariant,
      marginTop: spacing.xs,
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

  if (filteredTransactions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall" style={styles.emptyText}>
            거래 내역이 없습니다
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            새로운 거래를 추가해보세요
          </Text>
        </View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={onAdd}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onAdd}
      />
    </View>
  );
}
