'use client';

import { useEffect, useState, useRef } from 'react';

const easeOutQuad = (t: number) => t * (2 - t);

const CountingNumber = ({
  value,
  duration = 2000,
  className,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  className?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const progress = timestamp - startTimestamp;
      const percentage = Math.min(progress / duration, 1);
      const easedPercentage = easeOutQuad(percentage);

      setCount(easedPercentage * value);

      if (progress < duration) {
        animationFrameId.current = requestAnimationFrame(step);
      } else {
        setCount(value); // Ensure it ends on the exact value
      }
    };

    animationFrameId.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [value, duration]);

  return <span className={className}>{count.toFixed(decimals)}</span>;
};

export default CountingNumber;
