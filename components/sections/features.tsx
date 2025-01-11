'use client';

import { FileText, Shield, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Contract Review",
    description: "AI-powered contract analysis for accuracy, risk assessment, and compliance with Indian laws.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Corruption Reporting",
    description: "Secure and anonymous platform for reporting corruption with proper legal frameworks.",
  },
  {
    icon: <UserCog className="h-8 w-8" />,
    title: "Legal Document Generation",
    description: "Generate legally compliant documents tailored to your specific needs.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative">
      <div className="relative p-8 bg-card rounded-xl border border-border/50 hover:border-primary/50 transition-colors duration-300">
        <div className="text-primary mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}