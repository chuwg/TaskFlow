# TaskFlow 테마 시스템

TaskFlow 앱의 테마 시스템은 Material Design 3를 기반으로 하며, 다크 모드, 커스텀 테마, 반응형 디자인을 지원합니다.

## 기능

- 라이트/다크 모드 지원
- 시스템 테마 연동
- 커스텀 테마 프리셋
- 반응형 레이아웃
- 동적 폰트 크기
- 애니메이션 효과

## 사용 방법

### 테마 사용하기

```typescript
import { useTheme } from "@/hooks/useTheme";

const MyComponent = () => {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.onBackground }}>
        테마가 적용된 텍스트
      </Text>
    </View>
  );
};
```

### 반응형 레이아웃

```typescript
import { useResponsiveTheme } from "@/hooks/useResponsiveTheme";

const MyComponent = () => {
  const { getResponsiveLayout } = useResponsiveTheme();
  const { columns, gap } = getResponsiveLayout(2);

  return (
    <ResponsiveContainer defaultColumns={columns}>
      {/* 자식 컴포넌트들 */}
    </ResponsiveContainer>
  );
};
```

### 애니메이션 효과

```typescript
import { useThemedAnimation } from "@/hooks/useThemedAnimation";

const MyComponent = () => {
  const { animatedColors } = useThemedAnimation();

  return (
    <Animated.View
      style={{
        backgroundColor: animatedColors.background,
      }}
    >
      {/* 자식 컴포넌트들 */}
    </Animated.View>
  );
};
```

## 테마 프리셋

기본 제공되는 테마 프리셋:

- 기본 테마
- 자연 테마
- 바다 테마
- 선셋 테마
- 모던 테마
- 미니멀 테마

각 프리셋은 라이트/다크 모드를 지원합니다.

## 성능 최적화

### 메모이제이션

```typescript
import { useThemeMemo } from "@/hooks/useThemeMemo";

const MyComponent = () => {
  const styles = useThemeMemo((theme) =>
    StyleSheet.create({
      container: {
        backgroundColor: theme.colors.background,
      },
    })
  );

  return <View style={styles.container} />;
};
```

### 캐싱

```typescript
import { useThemeCache } from "@/hooks/useThemeCache";

const MyComponent = () => {
  const { getCachedValue } = useThemeCache();

  const value = getCachedValue(
    "myKey",
    (theme) => computeExpensiveValue(theme),
    [dependency1, dependency2]
  );

  return <View>{value}</View>;
};
```

## 디버깅

개발 모드에서는 ThemeInspector 컴포넌트를 통해 현재 테마 상태를 확인할 수 있습니다.

```typescript
import { ThemeInspector } from "@/components/debug/ThemeInspector";

const MyComponent = () => {
  return <View>{__DEV__ && <ThemeInspector />}</View>;
};
```

## 컴포넌트 목록

- `Card`: 기본 카드 컴포넌트
- `Button`: 다양한 스타일의 버튼
- `Input`: 입력 필드
- `ListItem`: 리스트 아이템
- `Text`: 타이포그래피 컴포넌트
- `AnimatedCard`: 애니메이션 효과가 있는 카드
- `ResponsiveContainer`: 반응형 레이아웃 컨테이너

각 컴포넌트는 테마 시스템과 완벽하게 통합되어 있습니다.
