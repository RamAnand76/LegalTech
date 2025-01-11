'use client';

import { useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

export function TypewriterEffect({
  words,
  className = '',
  cursorClassName = '',
}: {
  words: { text: string; className?: string }[];
  className?: string;
  cursorClassName?: string;
}) {
  const controls = useAnimation();
  
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  return (
    <div className={`${className} inline-block`}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          custom={idx}
          variants={textVariants}
          initial="hidden"
          animate={controls}
          className={`inline-block ${word.className || ''}`}
        >
          {word.text}{' '}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className={`inline-block w-[4px] h-[24px] bg-primary align-middle ${cursorClassName}`}
      />
    </div>
  );
}