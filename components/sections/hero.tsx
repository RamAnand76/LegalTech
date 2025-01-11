'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { TextStream } from '@/components/ui/text-stream';

const words = [
  { text: "Legal" },
  { text: "Intelligence" },
  { text: "Platform", className: "text-primary" },
];

const description = "Empowering businesses and individuals with AI-driven legal solutions. Streamline contract reviews, ensure compliance, and protect your interests.";

export function HeroSection() {
  return (
    <section className="relative px-4 py-32 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#e2e8ff,transparent)]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <TypewriterEffect words={words} className="text-5xl sm:text-7xl font-bold tracking-tight" />
        </div>
        
        <TextStream 
          text={description}
          className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
          delay={1000}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Link
            href="/login"
            className="group relative rounded-xl px-6 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 inline-block" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}