import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Text } from '@/components/typography/Text';
import { useTheme } from '@/hooks/useTheme';
import type { TodoStats } from '@/types/todo';

interface TodoStatsProps {
  stats: TodoStats;
}

export const TodoStatsComponent: React.FC<TodoStatsProps> = ({ stats }) => {
  const { theme } = useTheme();

  const getCompletionRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const getOverdueRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.overdue / stats.total) * 100);
  };

  return (
    <Card style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          할일 현황
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          완료율: {getCompletionRate()}%
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {/* 전체 할일 */}
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            {stats.total}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            전체
          </Text>
        </View>

        {/* 대기 중 */}
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.outline }}>
            {stats.pending}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            대기
          </Text>
        </View>

        {/* 진행 중 */}
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            {stats.inProgress}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            진행중
          </Text>
        </View>

        {/* 완료 */}
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            {stats.completed}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            완료
          </Text>
        </View>

        {/* 취소 */}
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.error }}>
            {stats.cancelled}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            취소
          </Text>
        </View>

        {/* 마감일 지남 */}
        <View style={styles.statItem}>
          <Text variant="headlineMedium" style={{ color: theme.colors.error }}>
            {stats.overdue}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            지연
          </Text>
        </View>
      </View>

      {/* 오늘 완료한 할일 */}
      {stats.completedToday > 0 && (
        <View style={styles.todayStats}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            오늘 완료: {stats.completedToday}개
          </Text>
        </View>
      )}

      {/* 이번 주 완료한 할일 */}
      {stats.completedThisWeek > 0 && (
        <View style={styles.weekStats}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            이번 주 완료: {stats.completedThisWeek}개
          </Text>
        </View>
      )}

      {/* 이번 달 완료한 할일 */}
      {stats.completedThisMonth > 0 && (
        <View style={styles.monthStats}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            이번 달 완료: {stats.completedThisMonth}개
          </Text>
        </View>
      )}

      {/* 평균 완료 시간 */}
      {stats.averageCompletionTime > 0 && (
        <View style={styles.timeStats}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            평균 완료 시간: {Math.round(stats.averageCompletionTime)}분
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '16%',
    marginBottom: 12,
  },
  todayStats: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  weekStats: {
    marginTop: 8,
  },
  monthStats: {
    marginTop: 8,
  },
  timeStats: {
    marginTop: 8,
  },
});
