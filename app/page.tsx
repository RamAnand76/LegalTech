'use client';

import { HeroSection } from '@/components/sections/hero';
import { FeaturesGrid } from '@/components/sections/features';
import { StatsSection } from '@/components/sections/stats';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <HeroSection />
      <FeaturesGrid />
      <StatsSection />
    </main>
  );
}