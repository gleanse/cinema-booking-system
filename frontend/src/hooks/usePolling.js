import { useEffect, useRef } from 'react';

export function usePolling(callback, interval) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!interval) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, interval);

    return () => clearInterval(id);
  }, [interval]);
}
