import { useAuth } from '@/context/AuthContext';

interface UserRole {
  name: string;
  scope: 'GLOBAL' | 'RAMA' | 'OWN';
  scopeId?: number;
}

interface User {
  username: string;
  roles: UserRole[];
  [key: string]: any;
}

export function useRBAC() {
  const { user, isLoading } = useAuth();

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

  return {
    user: user as User | null,
    isLoading,
    hasRole,
    hasScopeAccess,
    isSuperAdmin,
    getUserRoles,
  };
}
