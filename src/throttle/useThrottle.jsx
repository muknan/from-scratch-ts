import { useRef, useCallback, useEffect, useState } from "react";

function useThrottle(callback, delay) {
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

export default function UseThrottleApp() {
  const [scrollY, setScrollY] = useState(0);

  const items = new Array(20).fill(null);
  const paragraphs = [];

  for (const i in items) {
    paragraphs.push(<h2 key={i}>This is heading number {Number(i) + 1}</h2>);
  }

  const handleScroll = useThrottle(() => {
    setScrollY(window.scrollY);
  }, 1000);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div>
      {paragraphs}
      <h1>Scroll Y: {scrollY}</h1>
      <h1>Scroll Y: {scrollY}</h1>
      <h1>Scroll Y: {scrollY}</h1>
      <h1>Scroll Y: {scrollY}</h1>
      {paragraphs}
    </div>
  );
}
