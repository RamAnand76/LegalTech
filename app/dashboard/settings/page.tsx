'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Palette, HelpCircle, Info, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch user profile
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (data) {
          setName(data.full_name || '');
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1">
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

        <AnimatePresence mode="wait">
          <TabsContent value="profile" asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="mt-1 bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleUpdateProfile} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="personalization" asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Personalization</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Theme</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred theme
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="hover:scale-105 transition-transform"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {theme === 'dark' ? (
                          <motion.div
                            key="moon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Moon className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="sun"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Sun className="h-5 w-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="faq" asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b pb-4"
                    >
                      <h3 className="font-medium mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="about" asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}