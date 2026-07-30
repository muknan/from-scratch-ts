import { useRef, useCallback, useEffect } from "react";

export default function useThrottle(callback, delay) {
  const lastCallRef = useRef(0);
  const timeOutRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttled = useCallback(
    (...args) => {
      const now = Date.now();
      const last = lastCallRef.current;
      const remaining = delay - (now - last);

      if (remaining <= 0) {
        if (timeOutRef.current) {
          clearTimeout(timeOutRef.current);
          timeOutRef.current = null;
        }
        lastCallRef.current = now;
        callbackRef.current(...args);
      } else if (!timeOutRef.current) {
        timeOutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          timeOutRef.current = null;
          callbackRef.current(...args);
        }, remaining);
      }
    },
    [delay],
  );

  useEffect(() => {
    return () => {
      clearTimeout(timeOutRef.current);
      timeOutRef.current = null;
    };
  }, []);

  return throttled;
}
