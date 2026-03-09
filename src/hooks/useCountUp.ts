import { useState, useEffect, useRef } from "react";

export function useCountUp(endValue: string, duration: number = 1800) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  // Parse the numeric part from strings like "390만+", "3,597+", "18개"
  const numericMatch = endValue.match(/[\d,]+/);
  const numericString = numericMatch ? numericMatch[0].replace(/,/g, "") : "0";
  const targetNumber = parseInt(numericString, 10);
  
  // Extract prefix, suffix (e.g., "만+", "개", "+")
  const prefix = endValue.match(/^[^\d]*/)?.[0] || "";
  const suffix = endValue.match(/[^\d,]*$/)?.[0] || "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * targetNumber);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetNumber);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, targetNumber, duration]);

  // Format with commas
  const formattedCount = count.toLocaleString();
  const display = `${prefix}${formattedCount}${suffix}`;

  return { display, ref };
}
