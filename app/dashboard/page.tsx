'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { BarChart, FileText, Shield, UserCog } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  const stats = [
    { label: 'Documents Reviewed', value: '24', icon: FileText },
    { label: 'Reports Filed', value: '12', icon: Shield },
    { label: 'Documents Generated', value: '36', icon: UserCog },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Welcome Section */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Welcome back, {user.email}
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your legal documents today.
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <BarChart className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div>
                <p className="font-medium">Contract Review #{i + 1}</p>
                <p className="text-sm text-muted-foreground">
                  Completed {i + 1} hour{i !== 0 ? 's' : ''} ago
                </p>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}