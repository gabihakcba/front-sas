"use client";

import type { ReactNode } from "react";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import type { AllowedRoles } from "@/types/auth";

interface RoleGuardProps {
  allowedRoles: AllowedRoles;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const hasAccess = useRoleAccess(allowedRoles);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
