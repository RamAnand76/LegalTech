'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TextStreamProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function TextStream({ 
  text, 
  className = "", 
  delay = 0,
  speed = 30 
}: TextStreamProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {displayedText}
    </motion.p>
  );
}