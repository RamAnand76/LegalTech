'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { TextStream } from '@/components/ui/text-stream';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/auth/auth-card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <AuthCard
      title="Welcome back to LegalTech"
      subtitle="Sign in to access your legal dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          <Lock className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <TextStream
          text="Don't have an account?"
          className="text-muted-foreground inline-block mr-2"
          delay={2000}
        />
        <Link
          href="/signup"
          className="text-primary hover:text-primary/90 font-medium"
        >
          Sign up
        </Link>
      </div>
    </AuthCard>
  );
}