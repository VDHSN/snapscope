/**
 * Performance optimization utilities
 * Includes debouncing, memoization, and lazy loading helpers
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Debounce hook for expensive operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for frequent operations
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);
  const lastCallTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      } else {
        clearTimeout(lastCallTimer.current);
        lastCallTimer.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, delay - (now - lastCall.current));
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Memoized expensive computation hook
 */
export function useExpensiveComputation<T>(
  computation: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(computation, deps);
}

/**
 * Virtual scrolling utilities
 */
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll<T>(
  items: T[],
  { itemHeight, containerHeight, overscan = 5 }: VirtualScrollOptions
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + visibleCount + overscan,
    items.length
  );
  const visibleStartIndex = Math.max(0, startIndex - overscan);

  const visibleItems = useMemo(() => {
    return items.slice(visibleStartIndex, endIndex).map((item, index) => ({
      item,
      index: visibleStartIndex + index,
    }));
  }, [items, visibleStartIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStartIndex * itemHeight;

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
  };
}

/**
 * Image lazy loading hook
 */
export function useLazyImage(src: string, options?: IntersectionObserverInit) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, options]);

  const onLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
  }, []);

  const onError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
  }, []);

  return {
    imageSrc,
    isLoaded,
    isError,
    imgRef,
    onLoad,
    onError,
  };
}

/**
 * Batched updates for better performance
 */
export function useBatchedUpdates<T>() {
  const [batchedData, setBatchedData] = useState<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pendingData = useRef<T[]>([]);

  const addToBatch = useCallback((data: T) => {
    pendingData.current.push(data);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setBatchedData(prev => [...prev, ...pendingData.current]);
      pendingData.current = [];
    }, 100); // Batch updates every 100ms
  }, []);

  const clearBatch = useCallback(() => {
    setBatchedData([]);
    pendingData.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    batchedData,
    addToBatch,
    clearBatch,
  };
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(name: string) {
  const startTime = useRef<number>(0);

  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const end = useCallback(() => {
    const duration = performance.now() - startTime.current;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }, [name]);

  const measure = useCallback(<T,>(fn: () => T): T => {
    start();
    const result = fn();
    end();
    return result;
  }, [start, end]);

  return {
    start,
    end,
    measure,
  };
}