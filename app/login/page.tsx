'use client';

import { useState } from 'react';
import router, { useRouter } from 'next/router';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { TextStream } from '@/components/ui/text-stream';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/auth/auth-card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      router.push('/dashboard'); // Redirect to the dashboard page
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          <Lock className="mr-2 h-4 w-4" />
          {loading ? 'Signing in...' : 'Sign In'}
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