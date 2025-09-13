import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Dialog, TextInput, Button, SegmentedButtons, Chip } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/typography/Text';
import { Button as CustomButton } from '@/components/shared/Button';
import type { Todo, TodoStatus, TodoPriority, TodoCategory } from '@/types/todo';

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (todo: Partial<Todo>) => void;
  onCancel: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  todo,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as TodoStatus,
    priority: 'medium' as TodoPriority,
    category: 'other' as TodoCategory,
    dueDate: undefined as Date | undefined,
    estimatedTime: undefined as number | undefined,
    tags: [] as string[],
    location: '',
    notes: '',
    color: '',
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        status: todo.status,
        priority: todo.priority,
        category: todo.category,
        dueDate: todo.dueDate,
        estimatedTime: todo.estimatedTime,
        tags: [...todo.tags],
        location: todo.location || '',
        notes: todo.notes || '',
        color: todo.color || '',
      });
    }
  }, [todo]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

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

  return (
    <Dialog.Content style={{ backgroundColor: theme.colors.background }}>
      <ScrollView style={styles.container}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, marginBottom: 16 }}>
          {todo ? '할일 수정' : '새 할일 추가'}
        </Text>

        {/* 제목 */}
        <TextInput
          label="제목 *"
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          style={styles.input}
          mode="outlined"
        />

        {/* 설명 */}
        <TextInput
          label="설명"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        {/* 우선순위 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
            우선순위
          </Text>
          <SegmentedButtons
            value={formData.priority}
            onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as TodoPriority }))}
            buttons={priorityOptions}
            style={styles.segmentedButtons}
          />
        </View>

        {/* 카테고리 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
            카테고리
          </Text>
          <SegmentedButtons
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as TodoCategory }))}
            buttons={categoryOptions}
            style={styles.segmentedButtons}
          />
        </View>

        {/* 마감일 */}
        <TextInput
          label="마감일 (선택사항)"
          value={formData.dueDate ? formData.dueDate.toLocaleDateString('ko-KR') : ''}
          style={styles.input}
          mode="outlined"
          placeholder="YYYY-MM-DD"
          right={<TextInput.Icon icon="calendar" />}
        />

        {/* 예상 소요 시간 */}
        <TextInput
          label="예상 소요 시간 (분)"
          value={formData.estimatedTime?.toString() || ''}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            estimatedTime: text ? parseInt(text) : undefined 
          }))}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
        />

        {/* 위치 */}
        <TextInput
          label="위치"
          value={formData.location}
          onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
          style={styles.input}
          mode="outlined"
          right={<TextInput.Icon icon="map-marker" />}
        />

        {/* 태그 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
            태그
          </Text>
          <View style={styles.tagInput}>
            <TextInput
              label="태그 추가"
              value={newTag}
              onChangeText={setNewTag}
              style={styles.tagTextInput}
              mode="outlined"
              onSubmitEditing={addTag}
            />
            <Button mode="outlined" onPress={addTag} style={styles.addTagButton}>
              추가
            </Button>
          </View>
          {formData.tags.length > 0 && (
            <View style={styles.tags}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  onClose={() => removeTag(tag)}
                  style={styles.tagChip}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </View>

        {/* 메모 */}
        <TextInput
          label="메모"
          value={formData.notes}
          onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />
      </ScrollView>

      <Dialog.Actions>
        <CustomButton mode="outlined" onPress={onCancel}>
          취소
        </CustomButton>
        <CustomButton
          mode="contained"
          onPress={handleSubmit}
          disabled={!formData.title.trim()}
        >
          {todo ? '수정' : '추가'}
        </CustomButton>
      </Dialog.Actions>
    </Dialog.Content>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
  },
  input: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  tagInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tagTextInput: {
    flex: 1,
  },
  addTagButton: {
    marginTop: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tagChip: {
    marginRight: 4,
    marginBottom: 4,
  },
});
