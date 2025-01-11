'use client';

import { motion } from 'framer-motion';

const stats = [
  { label: 'Active Users', value: '10,000+' },
  { label: 'Documents Processed', value: '1M+' },
  { label: 'Success Rate', value: '99.9%' },
  { label: 'Time Saved', value: '1000h+' },
];

export function StatsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-background border border-border/50"
            >
              <div className="text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}