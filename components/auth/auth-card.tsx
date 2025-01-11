'use client';

import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { TextStream } from '@/components/ui/text-stream';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50">
          <div className="flex justify-center mb-6">
            <Scale className="h-12 w-12 text-primary" />
          </div>
          
          <TextStream
            text={title}
            className="text-2xl font-semibold text-center mb-2"
          />
          
          <TextStream
            text={subtitle}
            className="text-muted-foreground text-center mb-8"
            delay={1000}
          />

          {children}
        </div>
      </motion.div>
    </div>
  );
}