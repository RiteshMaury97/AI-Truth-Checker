
'use client';

import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const Counter = ({ to }: { to: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < to) {
          current += Math.ceil((to - current) / 20);
          if (ref.current) {
            ref.current.textContent = current.toLocaleString();
          }
        } else {
          clearInterval(interval);
        }
      }, 50);
    }
  }, [inView, to]);

  return <span ref={ref}>0</span>;
};

export default Counter;
