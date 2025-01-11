'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
}

export function AuthForm({ onSubmit, children }: AuthFormProps) {
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      onSubmit={onSubmit}
      className="space-y-4 w-full"
    >
      {children}
    </motion.form>
  );
}