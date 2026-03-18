import type { AllowedRoles, RoleScope, User, UserRole } from "@/types/auth";

export interface AccessRule {
  role: UserRole;
  scopeType?: string;
  scopeId?: number | null;
}

export const hasAllowedRole = (
  userRoles: UserRole[] | null | undefined,
  allowedRoles: AllowedRoles,
): boolean => {
  if (allowedRoles.length === 0) {
    return true;
  }

  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  return allowedRoles.some((allowedRole) => userRoles.includes(allowedRole));
};

export const hasAccessRule = (
  userScopes: RoleScope[] | null | undefined,
  accessRules: AccessRule[],
): boolean => {
  if (accessRules.length === 0) {
    return true;
  }

  if (!userScopes || userScopes.length === 0) {
    return false;
  }

  return accessRules.some((rule) =>
    userScopes.some((scope) => {
      const matchesRole = scope.role === rule.role;
      const matchesScopeType =
        rule.scopeType === undefined || scope.scopeType === rule.scopeType;
      const matchesScopeId =
        rule.scopeId === undefined || scope.scopeId === rule.scopeId;

      return matchesRole && matchesScopeType && matchesScopeId;
    }),
  );
};

const FULL_GROUP_ACCESS_ROLES = new Set<UserRole>([
  "ADM",
  "AYUDANTE",
  "DEV",
  "JEFATURA",
  "INTENDENCIA",
  "SECRETARIA_TESORERIA",
]);

export const hasFullGroupAccess = (
  user: User | null | undefined,
): boolean =>
  (user?.scopes ?? []).some(
    (scope) =>
      FULL_GROUP_ACCESS_ROLES.has(scope.role) &&
      (scope.scopeType === "GRUPO" || scope.scopeType === "GLOBAL"),
  );

const ADULT_MEMBER_ROLES = new Set<UserRole>([
  "ADM",
  "AYUDANTE",
  "OWN",
  "JEFATURA",
  "SECRETARIA_TESORERIA",
  "JEFATURA_RAMA",
  "AYUDANTE_RAMA",
  "INTENDENCIA",
]);

export const hasAdultMemberAccess = (
  user: User | null | undefined,
): boolean => (user?.roles ?? []).some((role) => ADULT_MEMBER_ROLES.has(role));

export const hasPermissionAccess = (
  user: User | null | undefined,
  requiredPermission: string,
): boolean => {
  if (hasFullGroupAccess(user)) {
    return true;
  }

  const permissions = user?.permissions ?? [];

  if (permissions.includes(requiredPermission)) {
    return true;
  }

  const [, resource] = requiredPermission.split(":");
  return permissions.includes(`MANAGE:${resource}`);
};
