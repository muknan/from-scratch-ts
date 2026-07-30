import { useEffect, useState } from "react";
import useThrottle from "./useThrottle";

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
