import { useAuth } from '@/context/AuthContext';
import { UserRole, UserSession } from '@/lib/utils';

interface User extends UserSession {}

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

  /**
   * Check if user has permission to perform action on resource
   * This is a simplified implementation that maps resource-action to roles
   * @param resource - The resource type
   * @param action - The action to perform
   * @returns true if user has permission
   */
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user || !user.roles) return false;

    // SUPER_ADMIN can do anything
    if (isSuperAdmin()) return true;

    // Check for MANAGE permission (includes all actions)
    const hasManage = user.roles.some(
      (role: UserRole) => role.name === 'MANAGE'
    );
    if (hasManage) return true;

    // Resource-specific role mappings
    // This is a simplified mapping - in production, this should come from backend
    const roleMapping: Record<string, Record<string, string[]>> = {
      ADULTO: {
        READ: ['JEFE_GRUPO', 'SECRETARIA', 'JEFE_RAMA'],
        CREATE: ['JEFE_GRUPO', 'SECRETARIA'],
        UPDATE: ['JEFE_GRUPO', 'SECRETARIA'],
        DELETE: ['JEFE_GRUPO'],
      },
      PROTAGONISTA: {
        READ: [
          'JEFE_GRUPO',
          'JEFE_RAMA',
          'SECRETARIA',
          'FAMILIA',
          'MIEMBRO_ACTIVO',
        ],
        CREATE: ['JEFE_GRUPO', 'JEFE_RAMA', 'SECRETARIA'],
        UPDATE: ['JEFE_GRUPO', 'JEFE_RAMA', 'SECRETARIA'],
        DELETE: ['JEFE_GRUPO', 'SECRETARIA'],
      },
      PAGO: {
        READ: ['JEFE_GRUPO', 'TESORERIA', 'FAMILIA'],
        CREATE: ['JEFE_GRUPO', 'TESORERIA'],
        UPDATE: ['JEFE_GRUPO', 'TESORERIA'],
        DELETE: ['JEFE_GRUPO', 'TESORERIA'],
      },
    };

    const allowedRoles = roleMapping[resource]?.[action] || [];
    return allowedRoles.some((roleName) => hasRole(roleName));
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
