'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, FileText, Shield, UserCog, X } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications] = useState([
    {
      id: 1,
      type: 'contract',
      title: 'Contract Review Complete',
      message: 'The review of "Service Agreement" has been completed.',
      time: '2 hours ago',
      icon: FileText,
    },
    {
      id: 2,
      type: 'report',
      title: 'New Report Status',
      message: 'Your corruption report #123 status has been updated.',
      time: '5 hours ago',
      icon: Shield,
    },
    {
      id: 3,
      type: 'document',
      title: 'Document Generated',
      message: 'Your NDA document has been generated successfully.',
      time: '1 day ago',
      icon: UserCog,
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline">
          Mark All as Read
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <notification.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}