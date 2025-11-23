'use client';

import { ReactNode } from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { RESOURCE, ACTION } from '@/common/types/rbac';

interface ProtectProps {
  children: ReactNode;
  roles?: string | string[];
  resource?: RESOURCE;
  action?: ACTION;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles; if false, ANY role
}

/**
 * Protect component for role-based and resource-based content rendering
 * This component prevents hydration mismatches by waiting for auth to load
 *
 * @example Role-based
 * <Protect roles="SUPER_ADMIN">
 *   <AdminPanel />
 * </Protect>
 *
 * @example Resource-based
 * <Protect resource={RESOURCE.ADULTO} action={ACTION.UPDATE}>
 *   <EditButton />
 * </Protect>
 */
export function Protect({
  children,
  roles,
  resource,
  action,
  fallback = null,
  requireAll = false,
}: ProtectProps) {
  const { isLoading, hasRole, hasPermission, user } = useRBAC();

  // During loading, render nothing to prevent hydration mismatch
  if (isLoading) {
    return null;
  }

  // If no user is logged in, show fallback
  if (!user) {
    return <>{fallback}</>;
  }

  // Resource-based permission check (takes priority)
  if (resource && action) {
    const hasAccess = hasPermission(resource, action);
    return <>{hasAccess ? children : fallback}</>;
  }

  // Role-based permission check (legacy support)
  if (roles) {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    let hasAccess: boolean;

    if (requireAll) {
      hasAccess = roleArray.every((role) => hasRole(role));
    } else {
      hasAccess = hasRole(roleArray);
    }

    return <>{hasAccess ? children : fallback}</>;
  }

  // If no roles or resource specified, just check if user exists (authenticated)
  return <>{children}</>;
}
