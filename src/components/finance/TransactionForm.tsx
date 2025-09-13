import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, TextInput, SegmentedButtons, Chip, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFinance } from '@/contexts/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import type { Transaction, TransactionType, PaymentMethod } from '@/types/finance';

interface TransactionFormProps {
  initialData?: Partial<Transaction>;
  onSave?: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export function TransactionForm({ 
  initialData, 
  onSave, 
  onCancel, 
  isEdit = false 
}: TransactionFormProps) {
  const { colors, spacing } = useTheme();
  const { 
    addTransaction, 
    updateTransaction, 
    accounts, 
    categories,
    loading 
  } = useFinance();

  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    currency: 'KRW',
    category: '',
    subcategory: '',
    description: '',
    date: new Date(),
    status: 'completed' as const,
    paymentMethod: 'cash' as PaymentMethod,
    accountId: '',
    tags: [] as string[],
    location: '',
    merchant: '',
    notes: '',
    isRecurring: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        amount: initialData.amount?.toString() || '',
        tags: initialData.tags || [],
      }));
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!formData.amount || !formData.category || !formData.description) {
      Alert.alert('오류', '필수 항목을 모두 입력해주세요.');
      return;
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      Alert.alert('오류', '올바른 금액을 입력해주세요.');
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: Number(formData.amount),
        id: initialData?.id || Date.now().toString(),
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (isEdit && initialData?.id) {
        await updateTransaction(initialData.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      onSave?.();
    } catch (error) {
      Alert.alert('오류', '거래를 저장하는 중 오류가 발생했습니다.');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.onBackground,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    input: {
      marginBottom: spacing.sm,
    },
    amountInput: {
      flex: 1,
      marginRight: spacing.sm,
    },
    currencyButton: {
      marginLeft: spacing.sm,
    },
    segmentedButtons: {
      marginBottom: spacing.md,
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
    tagInput: {
      flex: 1,
      marginRight: spacing.sm,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.md,
      backgroundColor: colors.surface,
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 거래 유형 */}
        <View style={styles.section}>
          <SegmentedButtons
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ 
              ...prev, 
              type: value as TransactionType,
              category: '', // 카테고리 초기화
            }))}
            buttons={[
              { value: 'expense', label: '지출', icon: 'minus' },
              { value: 'income', label: '수입', icon: 'plus' },
              { value: 'transfer', label: '이체', icon: 'swap-horizontal' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* 금액 */}
        <View style={styles.section}>
          <View style={styles.row}>
            <TextInput
              label="금액"
              value={formData.amount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
              keyboardType="numeric"
              style={styles.amountInput}
              mode="outlined"
            />
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.currencyButton}
            >
              {formData.currency}
            </Button>
          </View>
        </View>

        {/* 카테고리 */}
        <View style={styles.section}>
          <TextInput
            label="카테고리"
            value={formData.category}
            onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
            style={styles.input}
            mode="outlined"
            right={
              <TextInput.Icon 
                icon="chevron-down" 
                onPress={() => {
                  // 카테고리 선택 모달 표시
                }}
              />
            }
          />
          {filteredCategories.length > 0 && (
            <View style={styles.chipContainer}>
              {filteredCategories.map((category) => (
                <Chip
                  key={category.id}
                  selected={formData.category === category.id}
                  onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  style={styles.chip}
                  icon={category.icon}
                >
                  {category.name}
                </Chip>
              ))}
            </View>
          )}
        </View>

        {/* 설명 */}
        <View style={styles.section}>
          <TextInput
            label="설명"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={2}
          />
        </View>

        {/* 날짜 */}
        <View style={styles.section}>
          <TextInput
            label="날짜"
            value={formData.date.toLocaleDateString('ko-KR')}
            onPressIn={() => setShowDatePicker(true)}
            style={styles.input}
            mode="outlined"
            right={<TextInput.Icon icon="calendar" />}
            editable={false}
          />
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData(prev => ({ ...prev, date: selectedDate }));
                }
              }}
            />
          )}
        </View>

        {/* 결제 수단 */}
        <View style={styles.section}>
          <TextInput
            label="결제 수단"
            value={formData.paymentMethod}
            onChangeText={(text) => setFormData(prev => ({ ...prev, paymentMethod: text as PaymentMethod }))}
            style={styles.input}
            mode="outlined"
            right={
              <TextInput.Icon 
                icon="chevron-down" 
                onPress={() => {
                  // 결제 수단 선택 모달 표시
                }}
              />
            }
          />
        </View>

        {/* 계좌 */}
        {formData.type === 'transfer' && (
          <View style={styles.section}>
            <TextInput
              label="출금 계좌"
              value={formData.accountId}
              onChangeText={(text) => setFormData(prev => ({ ...prev, accountId: text }))}
              style={styles.input}
              mode="outlined"
            />
          </View>
        )}

        {/* 태그 */}
        <View style={styles.section}>
          <View style={styles.row}>
            <TextInput
              label="태그 추가"
              value={tagInput}
              onChangeText={setTagInput}
              style={styles.tagInput}
              mode="outlined"
              onSubmitEditing={addTag}
            />
            <IconButton
              icon="plus"
              onPress={addTag}
              mode="contained"
            />
          </View>
          {formData.tags.length > 0 && (
            <View style={styles.chipContainer}>
              {formData.tags.map((tag) => (
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

        {/* 추가 정보 */}
        <View style={styles.section}>
          <TextInput
            label="위치 (선택사항)"
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="가맹점 (선택사항)"
            value={formData.merchant}
            onChangeText={(text) => setFormData(prev => ({ ...prev, merchant: text }))}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="메모 (선택사항)"
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={2}
          />
        </View>
      </ScrollView>

      {/* 버튼 */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.button}
          disabled={loading}
        >
          취소
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          loading={loading}
        >
          {isEdit ? '수정' : '저장'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
