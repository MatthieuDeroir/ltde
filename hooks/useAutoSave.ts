import { useEffect, useRef } from 'react';

/**
 * Auto-save hook that triggers a callback after a delay when data changes
 * @param data - The data to watch for changes
 * @param onSave - Async callback to execute when auto-save triggers
 * @param delay - Delay in milliseconds (default: 30000 = 30 seconds)
 */
export function useAutoSave<T>(data: T, onSave: () => Promise<void>, delay: number = 30000) {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip auto-save on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      void onSave().catch((error) => {
        console.error('Auto-save failed:', error);
      });
    }, delay);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, onSave, delay]);
}
