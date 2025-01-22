'use client';

import { useState } from 'react';
import { FileText, Shield, UserCog, LogOut, Settings, Bell, Menu, Newspaper, User, Palette, HelpCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const sidebarItems = [
  { icon: FileText, label: 'Contract Review', href: '/dashboard/contracts' },
  { icon: Shield, label: 'Corruption Reporting', href: '/dashboard/reports' },
  { icon: UserCog, label: 'Document Generation', href: '/dashboard/documents' },
  { icon: Newspaper, label: 'Legal News', href: '/dashboard/news' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <nav className="p-4 space-y-2">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "transition-all duration-200",
              isCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">LegalTech Platform</h2>
                  </div>
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              {/* Desktop collapse button */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex mr-2"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Link href="/dashboard" className="text-xl font-bold">
                LegalTech Platform
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => logout()}>
                <LogOut className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-16">
        {/* Desktop Sidebar */}
        <aside className={cn(
          "hidden lg:block border-r bg-card fixed h-full transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-8 transition-all duration-300",
          "lg:ml-64",
          isCollapsed && "lg:ml-16"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}