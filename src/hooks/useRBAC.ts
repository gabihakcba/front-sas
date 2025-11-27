import { useAuth } from '@/context/AuthContext';
import { UserRole, UserSession } from '@/lib/utils';
import { useMyPermissionsQuery } from '@/hooks/queries/useAuth';

interface User extends UserSession {}

export function useRBAC() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { data: permissions = [], isLoading: isLoadingPermissions } =
    useMyPermissionsQuery();

  const isLoading = isLoadingAuth || isLoadingPermissions;

  /**
   * Check if the user has any of the specified roles
   * @param roleName - Single role name or array of role names
   * @returns true if user has at least one of the roles
   */
  const hasRole = (roleName: string | string[]): boolean => {
    if (!user || !user.roles) return false;

    const roleNames = Array.isArray(roleName) ? roleName : [roleName];

    return user.roles.some((role: UserRole) => roleNames.includes(role.name));
  };

  /**
   * Check if the user has access to a specific scope
   * @param requiredScope - The scope level required (GLOBAL, RAMA, OWN)
   * @param resourceScopeId - Optional: The specific resource ID to check against
   * @returns true if user has the required scope access
   */
  const hasScopeAccess = (
    requiredScope: 'GLOBAL' | 'RAMA' | 'OWN',
    resourceScopeId?: number
  ): boolean => {
    if (!user || !user.roles) return false;

    // GLOBAL scope grants access to everything
    const hasGlobalAccess = user.roles.some(
      (role: UserRole) => role.scope === 'GLOBAL'
    );
    if (hasGlobalAccess) return true;

    // If requiredScope is GLOBAL, user must have GLOBAL role
    if (requiredScope === 'GLOBAL') return false;

    // For RAMA scope, check if user has RAMA role with matching scopeId
    if (requiredScope === 'RAMA') {
      if (!resourceScopeId) {
        // If no specific resource ID, just check if they have any RAMA role
        return user.roles.some((role: UserRole) => role.scope === 'RAMA');
      }

      // Check for matching RAMA scopeId
      return user.roles.some(
        (role: UserRole) =>
          role.scope === 'RAMA' && role.scopeId === resourceScopeId
      );
    }

    // For OWN scope, check if user has OWN role with matching scopeId
    if (requiredScope === 'OWN') {
      if (!resourceScopeId) {
        return user.roles.some((role: UserRole) => role.scope === 'OWN');
      }

      return user.roles.some(
        (role: UserRole) =>
          role.scope === 'OWN' && role.scopeId === resourceScopeId
      );
    }

    return false;
  };

  /**
   * Check if user is a super admin
   * @returns true if user has SUPER_ADMIN role
   */
  const isSuperAdmin = (): boolean => {
    return hasRole('SUPER_ADMIN');
  };

  /**
   * Get all roles for the current user
   * @returns Array of user roles or empty array
   */
  const getUserRoles = (): UserRole[] => {
    return user?.roles || [];
  };

  /**
   * Check if user has permission to perform action on resource
   * Uses real permissions from backend
   * @param resource - The resource type
   * @param action - The action to perform
   * @returns true if user has permission
   */
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    // SUPER_ADMIN can do anything
    if (isSuperAdmin()) return true;

    const permissionKey = `${resource}:${action}`;
    const manageKey = `${resource}:MANAGE`;

    return (
      permissions?.includes(permissionKey) || permissions.includes(manageKey)
    );
  };

  return {
    user: user as User | null,
    isLoading,
    hasRole,
    hasScopeAccess,
    isSuperAdmin,
    getUserRoles,
    hasPermission,
  };
}
