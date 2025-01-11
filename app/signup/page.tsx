'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { TextStream } from '@/components/ui/text-stream';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/auth/auth-card';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthCard
      title="Join LegalTech Platform"
      subtitle="Create your account to get started"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="name"
            type="text"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <TextStream
          text="Already have an account?"
          className="text-muted-foreground inline-block mr-2"
          delay={2000}
        />
        <Link
          href="/login"
          className="text-primary hover:text-primary/90 font-medium"
        >
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}