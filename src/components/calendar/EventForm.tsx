import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Text } from '../typography/Text';
import { Switch, Portal, Modal } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { CalendarEvent, CalendarEventType } from '@/types/calendar';

interface EventFormProps {
  event?: CalendarEvent;
  onSubmit: (event: Partial<CalendarEvent>) => void;
  onCancel: () => void;
}

type DatePickerMode = 'start' | 'end';

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(event?.startDate || new Date());
  const [endDate, setEndDate] = useState(event?.endDate || new Date());
  const [allDay, setAllDay] = useState(event?.allDay || false);
  const [location, setLocation] = useState(event?.location || '');

  // DatePicker 상태
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentEditMode, setCurrentEditMode] = useState<DatePickerMode>('start');
  const [tempDate, setTempDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: allDay ? undefined : '2-digit',
      minute: allDay ? undefined : '2-digit',
    });
  };

  const showDatePicker = (mode: DatePickerMode) => {
    setCurrentEditMode(mode);
    setTempDate(mode === 'start' ? startDate : endDate);
    setPickerMode('date');
    setShowPicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setTempDate(selectedDate);
      
      if (Platform.OS === 'ios') {
        // iOS에서는 확인 버튼을 눌렀을 때만 최종 적용
        if (pickerMode === 'date' && !allDay) {
          setPickerMode('time');
        } else {
          applySelectedDate(selectedDate);
        }
      } else {
        // Android에서는 선택할 때마다 바로 적용
        if (pickerMode === 'date' && !allDay) {
          setPickerMode('time');
          setShowPicker(true);
        } else {
          applySelectedDate(selectedDate);
        }
      }
    } else {
      setShowPicker(false);
    }
  };

  const applySelectedDate = (finalDate: Date) => {
    if (currentEditMode === 'start') {
      setStartDate(finalDate);
      // 종료 시간이 시작 시간보다 이전이면 자동으로 조정
      if (endDate < finalDate) {
        setEndDate(new Date(finalDate.getTime() + 60 * 60 * 1000)); // +1 hour
      }
    } else {
      setEndDate(finalDate);
    }
    setShowPicker(false);
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      startDate,
      endDate,
      allDay,
      location,
      type: 'custom' as CalendarEventType,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Input
        label="제목"
        value={title}
        onChangeText={setTitle}
        placeholder="일정 제목을 입력하세요"
      />

      <Input
        label="설명"
        value={description}
        onChangeText={setDescription}
        placeholder="일정 설명을 입력하세요"
        multiline
        numberOfLines={3}
      />

      <View style={styles.switchContainer}>
        <Text>종일</Text>
        <Switch value={allDay} onValueChange={setAllDay} />
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.label}>시작 시간</Text>
        <Button
          mode="outlined"
          onPress={() => showDatePicker('start')}
        >
          {formatDate(startDate)}
        </Button>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.label}>종료 시간</Text>
        <Button
          mode="outlined"
          onPress={() => showDatePicker('end')}
        >
          {formatDate(endDate)}
        </Button>
      </View>

      <Input
        label="장소"
        value={location}
        onChangeText={setLocation}
        placeholder="장소를 입력하세요"
      />

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.button}
        >
          취소
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          disabled={!title}
        >
          저장
        </Button>
      </View>

      {showPicker && (
        <DateTimePicker
          value={tempDate}
          mode={pickerMode}
          is24Hour={true}
          display="spinner"
          onChange={handleDateChange}
          minimumDate={currentEditMode === 'end' ? startDate : undefined}
          locale="ko-KR"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  dateContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
});