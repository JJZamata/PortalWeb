import { useCallback, useRef } from 'react';

interface UseDebounceOptions {
  delay?: number;
}

export const useDebounce = (options: UseDebounceOptions = {}) => {
  const { delay = 300 } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback((callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
      timeoutRef.current = null;
    }, delay);
  }, [delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { debounce, cancel };
};
