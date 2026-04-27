import { useEffect, useRef, useCallback } from 'react';

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounced;
}

export function useSafeTimeout() {
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set());

  const setSafeTimeout = useCallback((cb: () => void, delay: number) => {
    const id = setTimeout(() => {
      timeoutRefs.current.delete(id);
      cb();
    }, delay);
    timeoutRefs.current.add(id);
    return id;
  }, []);

  const clearSafeTimeout = useCallback((id: NodeJS.Timeout) => {
    clearTimeout(id);
    timeoutRefs.current.delete(id);
  }, []);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current.clear();
    };
  }, []);

  return { set: setSafeTimeout, clear: clearSafeTimeout };
}
