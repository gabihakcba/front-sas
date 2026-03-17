"use client";

import { useAuth } from "@/context/AuthContext";
import { hasAllowedRole } from "@/lib/authorization";
import type { AllowedRoles } from "@/types/auth";

export const useRoleAccess = (allowedRoles: AllowedRoles): boolean => {
  const { user } = useAuth();

  return hasAllowedRole(user?.roles, allowedRoles);
};
