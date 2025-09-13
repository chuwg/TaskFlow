import { useRef, useCallback } from 'react';
import { useTheme } from './useTheme';
import type { CustomTheme } from '@/types/theme';

interface CacheEntry<T> {
  value: T;
  dependencies: any[];
}

export const useThemeCache = <T>() => {
  const { theme } = useTheme();
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());

  const getCachedValue = useCallback(
    (key: string, generator: (theme: CustomTheme) => T, dependencies: any[] = []) => {
      const cache = cacheRef.current;
      const cached = cache.get(key);

      if (cached && areArraysEqual(cached.dependencies, dependencies)) {
        return cached.value;
      }

      const value = generator(theme);
      cache.set(key, { value, dependencies });
      
      // 캐시 크기 제한
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return value;
    },
    [theme]
  );

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    getCachedValue,
    clearCache,
  };
};

// 배열 비교 헬퍼 함수
const areArraysEqual = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
};
