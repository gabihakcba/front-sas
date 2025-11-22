'use client';

import { ReactNode } from 'react';
import { useRBAC } from '@/hooks/useRBAC';

interface ProtectProps {
  children: ReactNode;
  roles?: string | string[];
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles; if false, ANY role
}

/**
 * Protect component for role-based content rendering
 * This component prevents hydration mismatches by waiting for auth to load
 *
 * @example
 * <Protect roles="SUPER_ADMIN">
 *   <AdminPanel />
 * </Protect>
 *
 * @example
 * <Protect roles={['SUPER_ADMIN', 'JEFE_RAMA']} fallback={<AccessDenied />}>
 *   <SensitiveContent />
 * </Protect>
 */
export function Protect({
  children,
  roles,
  fallback = null,
  requireAll = false,
}: ProtectProps) {
  const { isLoading, hasRole, user } = useRBAC();

  // During loading, render nothing to prevent hydration mismatch
  // This ensures client and server render the same initial content
  if (isLoading) {
    return null;
  }

  // If no user is logged in, show fallback
  if (!user) {
    return <>{fallback}</>;
  }

  // If no roles are specified, just check if user exists (authenticated)
  if (!roles) {
    return <>{children}</>;
  }

  const roleArray = Array.isArray(roles) ? roles : [roles];

  // Check role requirements
  let hasAccess: boolean;

  if (requireAll) {
    // User must have ALL specified roles
    hasAccess = roleArray.every((role) => hasRole(role));
  } else {
    // User must have AT LEAST ONE of the specified roles
    hasAccess = hasRole(roleArray);
  }

  // Render children if authorized, otherwise render fallback
  return <>{hasAccess ? children : fallback}</>;
}
