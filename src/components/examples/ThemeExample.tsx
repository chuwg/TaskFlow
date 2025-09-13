import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useResponsiveTheme } from '@/hooks/useResponsiveTheme';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { ListItem } from '../shared/ListItem';
import { Text } from '../typography/Text';
import { AnimatedCard } from '../shared/AnimatedCard';
import { ResponsiveContainer } from '../layout/ResponsiveContainer';

export const ThemeExample = () => {
  const { theme, isDarkMode, setThemeMode } = useTheme();
  const { getResponsiveLayout } = useResponsiveTheme();

  const { columns } = getResponsiveLayout(2);

  const toggleTheme = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

  const exampleItems = [
    { title: '기본 카드', content: '테마가 적용된 카드 컴포넌트' },
    { title: '애니메이션 카드', content: '전환 효과가 있는 카드' },
    { title: '입력 필드', content: '테마 기반 스타일링' },
    { title: '버튼 변형', content: '다양한 버튼 스타일' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text
        variant="headlineMedium"
        style={[styles.title, { color: theme.colors.primary }]}
      >
        테마 시스템 예시
      </Text>

      <ResponsiveContainer defaultColumns={columns}>
        {/* 기본 카드 예시 */}
        <Card title="기본 카드">
          <Text>테마 시스템이 적용된 기본 카드입니다.</Text>
          <Button
            mode="contained"
            onPress={toggleTheme}
            style={styles.button}
          >
            {isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          </Button>
        </Card>

        {/* 애니메이션 카드 예시 */}
        <AnimatedCard title="애니메이션 카드">
          <Text>테마 전환 시 애니메이션 효과가 적용됩니다.</Text>
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
          >
            예시 버튼
          </Button>
        </AnimatedCard>

        {/* 입력 필드 예시 */}
        <Card title="입력 필드">
          <Input
            label="이름"
            value=""
            onChangeText={() => {}}
            placeholder="이름을 입력하세요"
          />
          <Input
            label="이메일"
            value=""
            onChangeText={() => {}}
            placeholder="이메일을 입력하세요"
            keyboardType="email-address"
          />
        </Card>

        {/* 버튼 변형 예시 */}
        <Card title="버튼 스타일">
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => {}}>
              기본 버튼
            </Button>
            <Button mode="outlined" onPress={() => {}}>
              외곽선 버튼
            </Button>
            <Button mode="text" onPress={() => {}}>
              텍스트 버튼
            </Button>
          </View>
        </Card>

        {/* 리스트 아이템 예시 */}
        <Card title="리스트 아이템">
          {exampleItems.map((item, index) => (
            <ListItem
              key={index}
              title={item.title}
              description={item.content}
              onPress={() => {}}
            />
          ))}
        </Card>
      </ResponsiveContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
  buttonContainer: {
    gap: 8,
  },
});
