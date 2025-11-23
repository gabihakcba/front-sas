'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRBAC } from '@/hooks/useRBAC';
import { getFilteredMenu, MenuItem } from '@/config/navigation';
import { classNames } from 'primereact/utils';

/**
 * Sidebar component with role-based navigation
 * This component demonstrates how to use the RBAC system with dynamic navigation
 */
export function Sidebar() {
  const { user, isLoading } = useRBAC();
  const pathname = usePathname();

  // Filter menu items based on user roles
  // useMemo prevents unnecessary recalculations
  const menuItems = useMemo(() => {
    return getFilteredMenu(user);
  }, [user]);

  // Don't render anything while loading to prevent hydration mismatch
  if (isLoading) {
    return (
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4">
        <div className="space-y-2">
          {/* Loading skeleton */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-slate-800 rounded animate-pulse"
            />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* User info at bottom */}
      {user && (
        <div className="mt-8 p-3 bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-400">Conectado como:</p>
          <p className="text-white font-semibold truncate">{user.username}</p>
          {user.roles && user.roles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {user.roles.slice(0, 2).map((role, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded"
                >
                  {role.name}
                </span>
              ))}
              {user.roles.length > 2 && (
                <span className="text-xs text-slate-500">
                  +{user.roles.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

/**
 * Individual sidebar menu item
 */
function SidebarItem({
  item,
  isActive,
}: {
  item: MenuItem;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={classNames(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        {
          'bg-cyan-900/30 text-cyan-400': isActive,
          'text-slate-300 hover:bg-slate-800 hover:text-white': !isActive,
        }
      )}
    >
      <i className={classNames(item.icon, 'text-lg')} />
      <span className="font-medium">{item.label}</span>
    </Link>
  );
}
