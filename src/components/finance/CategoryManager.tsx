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
} from 'react-native-paper';
import { useFinance } from '@/contexts/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import type { Category, TransactionType } from '@/types/finance';

interface CategoryManagerProps {
  visible: boolean;
  onClose: () => void;
}

export function CategoryManager({ visible, onClose }: CategoryManagerProps) {
  const { colors, spacing } = useTheme();
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    loading 
  } = useFinance();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as TransactionType,
    color: '#2196F3',
    icon: '',
    isDefault: false,
  });

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense',
      color: '#2196F3',
      icon: '',
      isDefault: false,
    });
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon || '',
      isDefault: category.isDefault,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('오류', '카테고리 이름을 입력해주세요.');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setShowForm(false);
      setEditingCategory(null);
    } catch (error) {
      Alert.alert('오류', '카테고리를 저장하는 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = (category: Category) => {
    if (category.isDefault) {
      Alert.alert('오류', '기본 카테고리는 삭제할 수 없습니다.');
      return;
    }

    Alert.alert(
      '카테고리 삭제',
      `'${category.name}' 카테고리를 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id);
            } catch (error) {
              Alert.alert('오류', '카테고리를 삭제하는 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <Card style={styles.categoryCard}>
      <Card.Content>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryInfo}>
            <View style={styles.categoryTitle}>
              <Text variant="titleMedium">{item.name}</Text>
              <Chip
                icon={item.icon || 'tag'}
                style={[styles.typeChip, { backgroundColor: item.color + '20' }]}
                textStyle={{ color: item.color }}
                compact
              >
                {item.type === 'income' ? '수입' : item.type === 'expense' ? '지출' : '이체'}
              </Chip>
            </View>
            <View style={styles.categoryDetails}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <Text variant="bodySmall" style={styles.categoryMeta}>
                {item.isDefault ? '기본 카테고리' : '사용자 카테고리'}
              </Text>
            </View>
          </View>
          <View style={styles.categoryActions}>
            <IconButton
              icon="pencil"
              onPress={() => handleEdit(item)}
              disabled={item.isDefault}
            />
            <IconButton
              icon="delete"
              onPress={() => handleDelete(item)}
              disabled={item.isDefault}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderForm = () => (
    <Modal visible={showForm} animationType="slide">
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text variant="headlineSmall">
            {editingCategory ? '카테고리 수정' : '새 카테고리'}
          </Text>
          <IconButton icon="close" onPress={() => setShowForm(false)} />
        </View>

        <View style={styles.formContent}>
          <TextInput
            label="카테고리 이름"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            style={styles.input}
            mode="outlined"
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>거래 유형</Text>
            <SegmentedButtons
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as TransactionType }))}
              buttons={[
                { value: 'expense', label: '지출', icon: 'minus' },
                { value: 'income', label: '수입', icon: 'plus' },
                { value: 'transfer', label: '이체', icon: 'swap-horizontal' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>색상</Text>
            <View style={styles.colorPicker}>
              {[
                '#F44336', '#E91E63', '#9C27B0', '#673AB7',
                '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
                '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
              ].map((color) => (
                <Button
                  key={color}
                  mode={formData.color === color ? 'contained' : 'outlined'}
                  onPress={() => setFormData(prev => ({ ...prev, color }))}
                  style={[styles.colorButton, { backgroundColor: color }]}
                  buttonColor={color}
                  textColor={formData.color === color ? 'white' : color}
                >
                  {formData.color === color ? '✓' : ''}
                </Button>
              ))}
            </View>
          </View>

          <TextInput
            label="아이콘 (선택사항)"
            value={formData.icon}
            onChangeText={(text) => setFormData(prev => ({ ...prev, icon: text }))}
            style={styles.input}
            mode="outlined"
            placeholder="예: 🍽️, 🚗, 💰"
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
            {editingCategory ? '수정' : '추가'}
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
    categoryCard: {
      marginHorizontal: spacing.md,
      marginVertical: spacing.xs,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryInfo: {
      flex: 1,
    },
    categoryTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    typeChip: {
      marginLeft: spacing.sm,
    },
    categoryDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    colorIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: spacing.sm,
    },
    categoryMeta: {
      color: colors.onSurfaceVariant,
    },
    categoryActions: {
      flexDirection: 'row',
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
    colorPicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    colorButton: {
      width: 40,
      height: 40,
      margin: spacing.xs,
      borderRadius: 20,
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
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const transferCategories = categories.filter(c => c.type === 'transfer');

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.formHeader}>
          <Text variant="headlineSmall">카테고리 관리</Text>
          <IconButton icon="close" onPress={onClose} />
        </View>

        <FlatList
          data={[]}
          renderItem={() => null}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text variant="headlineSmall" style={styles.emptyText}>
                카테고리 목록
              </Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              {incomeCategories.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    수입 카테고리
                  </Text>
                  {incomeCategories.map((category) => (
                    <Card key={category.id} style={styles.categoryCard}>
                      <Card.Content>
                        <View style={styles.categoryHeader}>
                          <View style={styles.categoryInfo}>
                            <View style={styles.categoryTitle}>
                              <Text variant="titleMedium">{category.name}</Text>
                              <Chip
                                icon={category.icon || 'tag'}
                                style={[styles.typeChip, { backgroundColor: category.color + '20' }]}
                                textStyle={{ color: category.color }}
                                compact
                              >
                                수입
                              </Chip>
                            </View>
                            <View style={styles.categoryDetails}>
                              <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
                              <Text variant="bodySmall" style={styles.categoryMeta}>
                                {category.isDefault ? '기본 카테고리' : '사용자 카테고리'}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.categoryActions}>
                            <IconButton
                              icon="pencil"
                              onPress={() => handleEdit(category)}
                              disabled={category.isDefault}
                            />
                            <IconButton
                              icon="delete"
                              onPress={() => handleDelete(category)}
                              disabled={category.isDefault}
                            />
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  ))}
                </>
              )}

              {expenseCategories.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    지출 카테고리
                  </Text>
                  {expenseCategories.map((category) => (
                    <Card key={category.id} style={styles.categoryCard}>
                      <Card.Content>
                        <View style={styles.categoryHeader}>
                          <View style={styles.categoryInfo}>
                            <View style={styles.categoryTitle}>
                              <Text variant="titleMedium">{category.name}</Text>
                              <Chip
                                icon={category.icon || 'tag'}
                                style={[styles.typeChip, { backgroundColor: category.color + '20' }]}
                                textStyle={{ color: category.color }}
                                compact
                              >
                                지출
                              </Chip>
                            </View>
                            <View style={styles.categoryDetails}>
                              <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
                              <Text variant="bodySmall" style={styles.categoryMeta}>
                                {category.isDefault ? '기본 카테고리' : '사용자 카테고리'}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.categoryActions}>
                            <IconButton
                              icon="pencil"
                              onPress={() => handleEdit(category)}
                              disabled={category.isDefault}
                            />
                            <IconButton
                              icon="delete"
                              onPress={() => handleDelete(category)}
                              disabled={category.isDefault}
                            />
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  ))}
                </>
              )}

              {transferCategories.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    이체 카테고리
                  </Text>
                  {transferCategories.map((category) => (
                    <Card key={category.id} style={styles.categoryCard}>
                      <Card.Content>
                        <View style={styles.categoryHeader}>
                          <View style={styles.categoryInfo}>
                            <View style={styles.categoryTitle}>
                              <Text variant="titleMedium">{category.name}</Text>
                              <Chip
                                icon={category.icon || 'tag'}
                                style={[styles.typeChip, { backgroundColor: category.color + '20' }]}
                                textStyle={{ color: category.color }}
                                compact
                              >
                                이체
                              </Chip>
                            </View>
                            <View style={styles.categoryDetails}>
                              <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
                              <Text variant="bodySmall" style={styles.categoryMeta}>
                                {category.isDefault ? '기본 카테고리' : '사용자 카테고리'}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.categoryActions}>
                            <IconButton
                              icon="pencil"
                              onPress={() => handleEdit(category)}
                              disabled={category.isDefault}
                            />
                            <IconButton
                              icon="delete"
                              onPress={() => handleDelete(category)}
                              disabled={category.isDefault}
                            />
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  ))}
                </>
              )}
            </>
          )}
        />

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
