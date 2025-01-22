'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Palette, HelpCircle, Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="personalization" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Personalization
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="personalization">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Personalization</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <Button>Apply Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "How secure is my data?",
                  a: "We use industry-standard encryption and security measures to protect your data."
                },
                {
                  q: "Can I export my documents?",
                  a: "Yes, you can export your documents in various formats including PDF and Word."
                },
                {
                  q: "How do I report issues?",
                  a: "You can contact our support team through the help center or email support@legaltech.com"
                }
              ].map((faq, i) => (
                <div key={i} className="border-b pb-4">
                  <h3 className="font-medium mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">About LegalTech Platform</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                LegalTech Platform is a comprehensive legal technology solution designed to streamline legal processes,
                ensure compliance, and provide efficient document management for legal professionals and organizations.
              </p>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Version: 1.0.0</p>
                <p className="text-sm text-muted-foreground">© 2024 LegalTech Platform. All rights reserved.</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}