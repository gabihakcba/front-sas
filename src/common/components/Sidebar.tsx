'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getFilteredMenu } from '@/config/navigation';
import { Button } from 'primereact/button';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar';
import { classNames } from 'primereact/utils';

interface SidebarProps {
  visible?: boolean;
  onHide?: () => void;
  isMobile?: boolean;
}

/**
 * Sidebar component with role-based navigation
 * Features:
 * - Dynamic menu filtering based on user roles
 * - SUPER_ADMIN sees all items
 * - Active route highlighting
 * - Theme-aware styling using PrimeReact CSS variables
 * - Mobile responsive (drawer on mobile, fixed on desktop)
 */
export function Sidebar({
  visible = false,
  onHide,
  isMobile = false,
}: SidebarProps) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  // Filter menu items based on user roles
  const menuItems = useMemo(() => {
    return getFilteredMenu(user);
  }, [user]);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-surface-card">
      {/* Header with Logo */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <Image
            src="/scout.png"
            alt="Scout Logo"
            width={48}
            height={48}
            className="opacity-90"
          />
          <div>
            <h2 className="text-text-main font-bold text-lg">Scout SAS</h2>
            <p className="text-text-secondary text-xs">Adalberto Lopez 494</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onHide : undefined}
                className={classNames(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                  {
                    'bg-primary/10 text-primary': isActive,
                    'text-text-main hover:bg-surface-overlay': !isActive,
                  }
                )}
              >
                <i
                  className={classNames(item.icon, 'text-lg', {
                    'text-primary': isActive,
                    'text-text-secondary group-hover:text-text-main': !isActive,
                  })}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer with User Info and Logout */}
      <div className="p-4 border-t border-surface-border space-y-3">
        {/* User Info */}
        {user && (
          <div className="px-3 py-2 bg-surface-overlay rounded-lg">
            <p className="text-xs text-text-secondary mb-1">Conectado como:</p>
            <p className="text-text-main font-semibold text-sm truncate">
              {user.username || user.sub || 'Usuario'}
            </p>
            {user.roles && user.roles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {user.roles.slice(0, 2).map((role: any, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                  >
                    {role.name}
                  </span>
                ))}
                {user.roles.length > 2 && (
                  <span className="text-xs text-text-secondary">
                    +{user.roles.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        <Button
          label="Cerrar Sesión"
          icon="pi pi-power-off"
          iconPos="right"
          severity="danger"
          outlined
          className="w-full"
          onClick={logout}
        />
      </div>
    </div>
  );

  // Show loading skeleton while auth is initializing
  if (isLoading) {
    return (
      <aside className="hidden md:flex h-screen w-64 bg-surface-card border-r border-surface-border flex-col">
        <div className="p-6 border-b border-surface-border">
          <div className="h-12 bg-surface-overlay rounded animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-surface-overlay rounded animate-pulse"
            />
          ))}
        </div>
      </aside>
    );
  }

  // Mobile: Render as PrimeReact Sidebar (Drawer)
  if (isMobile) {
    return (
      <PrimeSidebar
        visible={visible}
        onHide={onHide || (() => {})}
        className="w-64"
        showCloseIcon={false}
      >
        {sidebarContent}
      </PrimeSidebar>
    );
  }

  // Desktop: Render as fixed sidebar
  return (
    <aside className="hidden md:flex h-screen w-64 bg-surface-card border-r border-surface-border flex-col">
      {sidebarContent}
    </aside>
  );
}
