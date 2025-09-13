import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import {
  Button,
  TextInput,
  Chip,
  SegmentedButtons,
  Checkbox,
  Divider,
  Text,
  IconButton,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFinance } from '@/contexts/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import type { TransactionFilter, TransactionType, PaymentMethod } from '@/types/finance';

interface TransactionFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: TransactionFilter) => void;
  initialFilter?: TransactionFilter;
}

export function TransactionFilter({ 
  visible, 
  onClose, 
  onApply, 
  initialFilter = {} 
}: TransactionFilterProps) {
  const { colors, spacing } = useTheme();
  const { categories, accounts } = useFinance();

  const [filter, setFilter] = useState<TransactionFilter>({
    type: initialFilter.type || [],
    status: initialFilter.status || [],
    category: initialFilter.category || [],
    paymentMethod: initialFilter.paymentMethod || [],
    accountId: initialFilter.accountId || [],
    amountRange: initialFilter.amountRange,
    dateRange: initialFilter.dateRange,
    tags: initialFilter.tags || [],
    searchQuery: initialFilter.searchQuery || '',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const transactionTypes: TransactionType[] = ['income', 'expense', 'transfer'];
  const paymentMethods: PaymentMethod[] = ['cash', 'card', 'bank_transfer', 'mobile_payment', 'cryptocurrency', 'other'];

  const handleTypeToggle = (type: TransactionType) => {
    setFilter(prev => ({
      ...prev,
      type: prev.type?.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...(prev.type || []), type],
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilter(prev => ({
      ...prev,
      category: prev.category?.includes(categoryId)
        ? prev.category.filter(c => c !== categoryId)
        : [...(prev.category || []), categoryId],
    }));
  };

  const handlePaymentMethodToggle = (method: PaymentMethod) => {
    setFilter(prev => ({
      ...prev,
      paymentMethod: prev.paymentMethod?.includes(method)
        ? prev.paymentMethod.filter(m => m !== method)
        : [...(prev.paymentMethod || []), method],
    }));
  };

  const handleAccountToggle = (accountId: string) => {
    setFilter(prev => ({
      ...prev,
      accountId: prev.accountId?.includes(accountId)
        ? prev.accountId.filter(a => a !== accountId)
        : [...(prev.accountId || []), accountId],
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !filter.tags?.includes(tagInput.trim())) {
      setFilter(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFilter(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  const handleReset = () => {
    setFilter({
      type: [],
      status: [],
      category: [],
      paymentMethod: [],
      accountId: [],
      amountRange: undefined,
      dateRange: undefined,
      tags: [],
      searchQuery: '',
    });
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      marginTop: 100,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    scrollView: {
      flex: 1,
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: spacing.sm,
      color: colors.onSurface,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.sm,
    },
    chip: {
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    input: {
      marginBottom: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    amountInput: {
      flex: 1,
      marginRight: spacing.sm,
    },
    dateInput: {
      flex: 1,
      marginRight: spacing.sm,
    },
    tagInput: {
      flex: 1,
      marginRight: spacing.sm,
    },
    buttonContainer: {
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
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text variant="headlineSmall">필터</Text>
            <IconButton icon="close" onPress={onClose} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* 검색 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>검색</Text>
              <TextInput
                label="설명, 가맹점, 위치로 검색"
                value={filter.searchQuery}
                onChangeText={(text) => setFilter(prev => ({ ...prev, searchQuery: text }))}
                style={styles.input}
                mode="outlined"
                left={<TextInput.Icon icon="magnify" />}
              />
            </View>

            {/* 거래 유형 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>거래 유형</Text>
              <View style={styles.chipContainer}>
                {transactionTypes.map((type) => (
                  <Chip
                    key={type}
                    selected={filter.type?.includes(type) || false}
                    onPress={() => handleTypeToggle(type)}
                    style={styles.chip}
                    icon={type === 'income' ? 'plus' : type === 'expense' ? 'minus' : 'swap-horizontal'}
                  >
                    {type === 'income' ? '수입' : type === 'expense' ? '지출' : '이체'}
                  </Chip>
                ))}
              </View>
            </View>

            {/* 카테고리 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>카테고리</Text>
              <View style={styles.chipContainer}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    selected={filter.category?.includes(category.id) || false}
                    onPress={() => handleCategoryToggle(category.id)}
                    style={styles.chip}
                    icon={category.icon}
                  >
                    {category.name}
                  </Chip>
                ))}
              </View>
            </View>

            {/* 결제 수단 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>결제 수단</Text>
              <View style={styles.chipContainer}>
                {paymentMethods.map((method) => (
                  <Chip
                    key={method}
                    selected={filter.paymentMethod?.includes(method) || false}
                    onPress={() => handlePaymentMethodToggle(method)}
                    style={styles.chip}
                  >
                    {method === 'cash' ? '현금' :
                     method === 'card' ? '카드' :
                     method === 'bank_transfer' ? '계좌이체' :
                     method === 'mobile_payment' ? '모바일결제' :
                     method === 'cryptocurrency' ? '암호화폐' : '기타'}
                  </Chip>
                ))}
              </View>
            </View>

            {/* 계좌 */}
            {accounts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>계좌</Text>
                <View style={styles.chipContainer}>
                  {accounts.map((account) => (
                    <Chip
                      key={account.id}
                      selected={filter.accountId?.includes(account.id) || false}
                      onPress={() => handleAccountToggle(account.id)}
                      style={styles.chip}
                    >
                      {account.name}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            {/* 금액 범위 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>금액 범위</Text>
              <View style={styles.row}>
                <TextInput
                  label="최소 금액"
                  value={filter.amountRange?.min?.toString() || ''}
                  onChangeText={(text) => setFilter(prev => ({
                    ...prev,
                    amountRange: {
                      ...prev.amountRange,
                      min: text ? Number(text) : undefined,
                      max: prev.amountRange?.max,
                    },
                  }))}
                  style={styles.amountInput}
                  mode="outlined"
                  keyboardType="numeric"
                />
                <TextInput
                  label="최대 금액"
                  value={filter.amountRange?.max?.toString() || ''}
                  onChangeText={(text) => setFilter(prev => ({
                    ...prev,
                    amountRange: {
                      ...prev.amountRange,
                      min: prev.amountRange?.min,
                      max: text ? Number(text) : undefined,
                    },
                  }))}
                  style={styles.amountInput}
                  mode="outlined"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* 날짜 범위 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>날짜 범위</Text>
              <View style={styles.row}>
                <TextInput
                  label="시작 날짜"
                  value={filter.dateRange?.start?.toLocaleDateString('ko-KR') || ''}
                  onPressIn={() => setShowStartDatePicker(true)}
                  style={styles.dateInput}
                  mode="outlined"
                  right={<TextInput.Icon icon="calendar" />}
                  editable={false}
                />
                <TextInput
                  label="종료 날짜"
                  value={filter.dateRange?.end?.toLocaleDateString('ko-KR') || ''}
                  onPressIn={() => setShowEndDatePicker(true)}
                  style={styles.dateInput}
                  mode="outlined"
                  right={<TextInput.Icon icon="calendar" />}
                  editable={false}
                />
              </View>
              {showStartDatePicker && (
                <DateTimePicker
                  value={filter.dateRange?.start || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      setFilter(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: selectedDate,
                          end: prev.dateRange?.end,
                        },
                      }));
                    }
                  }}
                />
              )}
              {showEndDatePicker && (
                <DateTimePicker
                  value={filter.dateRange?.end || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setFilter(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: prev.dateRange?.start,
                          end: selectedDate,
                        },
                      }));
                    }
                  }}
                />
              )}
            </View>

            {/* 태그 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>태그</Text>
              <View style={styles.row}>
                <TextInput
                  label="태그 추가"
                  value={tagInput}
                  onChangeText={setTagInput}
                  style={styles.tagInput}
                  mode="outlined"
                  onSubmitEditing={addTag}
                />
                <Button mode="contained" onPress={addTag}>
                  추가
                </Button>
              </View>
              {filter.tags && filter.tags.length > 0 && (
                <View style={styles.chipContainer}>
                  {filter.tags.map((tag) => (
                    <Chip
                      key={tag}
                      onClose={() => removeTag(tag)}
                      style={styles.chip}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.button}
            >
              초기화
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.button}
            >
              적용
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
