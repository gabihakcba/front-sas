'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { Sidebar } from '@/common/components/Sidebar';
import { TopBar } from '@/common/components/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-surface-ground text-text-main overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <Sidebar />

        {/* Mobile Sidebar (Drawer) */}
        <Sidebar
          visible={mobileMenuVisible}
          onHide={() => setMobileMenuVisible(false)}
          isMobile={true}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile TopBar */}
          <TopBar onMenuToggle={() => setMobileMenuVisible(true)} />

          {/* Desktop Header */}
          <header className="hidden md:flex h-16 border-b border-surface-border items-center px-3 bg-surface-card">
            <h1 className="text-xl font-bold text-text-main">Dashboard</h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-2 md:p-3">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
