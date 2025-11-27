import { UserSession } from '@/lib/utils';

interface User extends UserSession {}

export interface MenuItem {
  label: string;
  icon: string;
  href: string;
  allowedRoles?: string[]; // If undefined, accessible to all authenticated users
}

/**
 * Main navigation configuration for Dashboard
 * Items without allowedRoles are visible to all authenticated users
 * SUPER_ADMIN always sees all items regardless of allowedRoles
 */
export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    href: '/dashboard',
    // No allowedRoles = accessible to all authenticated users
  },
  {
    label: 'Protagonistas',
    icon: 'pi pi-users',
    href: '/dashboard/protagonistas',
    allowedRoles: [
      'SUPER_ADMIN',
      'JEFE_GRUPO',
      'JEFE_RAMA',
      'COLABORADOR_RAMA',
      'SECRETARIA',
      'FAMILIA',
      'MIEMBRO_ACTIVO',
    ],
  },
  {
    label: 'Adultos',
    icon: 'pi pi-id-card',
    href: '/dashboard/adultos',
    allowedRoles: [
      'SUPER_ADMIN',
      'JEFE_GRUPO',
      'SECRETARIA',
      'JEFE_RAMA',
      'COLABORADOR_RAMA',
    ],
  },
  {
    label: 'Responsables',
    icon: 'pi pi-user-edit',
    href: '/dashboard/responsables',
    allowedRoles: [
      'SUPER_ADMIN',
      'JEFE_GRUPO',
      'SECRETARIA',
      'JEFE_RAMA',
      'COLABORADOR_RAMA',
    ],
  },
  {
    label: 'Pagos',
    icon: 'pi pi-wallet',
    href: '/dashboard/pagos',
    allowedRoles: ['SUPER_ADMIN', 'JEFE_GRUPO', 'TESORERIA', 'FAMILIA'],
  },
  {
    label: 'Eventos',
    icon: 'pi pi-calendar',
    href: '/dashboard/eventos',
    allowedRoles: [
      'SUPER_ADMIN',
      'JEFE_GRUPO',
      'SECRETARIA',
      'TESORERIA',
      'JEFE_RAMA',
      'COLABORADOR_RAMA',
      'JEFE_AREA',
      'COLABORADOR_AREA',
      'MIEMBRO_ACTIVO',
      'FAMILIA',
    ],
  },
  {
    label: 'Logs',
    icon: 'pi pi-history',
    href: '/dashboard/logs',
    allowedRoles: ['SUPER_ADMIN'],
  },
  {
    label: 'Más Opciones',
    icon: 'pi pi-box',
    href: '/dashboard/mas-opciones',
    allowedRoles: [
      'SUPER_ADMIN',
      'JEFE_GRUPO',
      'TESORERIA',
      'JEFE_RAMA',
      'SECRETARIA',
      'COLABORADOR_RAMA',
    ],
  },
];

/**
 * Filter menu items based on user roles
 * SUPER_ADMIN always sees all items
 * @param user - Current authenticated user
 * @returns Filtered array of menu items the user can access
 */
export function getFilteredMenu(user: User | null): MenuItem[] {
  if (!user) return [];

  // Extract role names from user
  const userRoleNames = user.roles?.map((role) => role.name) || [];

  // SUPER_ADMIN sees everything
  if (userRoleNames.includes('SUPER_ADMIN')) {
    return MENU_ITEMS;
  }

  // Filter items based on allowedRoles
  return MENU_ITEMS.filter((item) => {
    // If no roles specified, item is accessible to all authenticated users
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }

    // Check if user has any of the allowed roles
    return item.allowedRoles.some((role) => userRoleNames.includes(role));
  });
}

/**
 * Check if a user can access a specific route
 * @param user - Current authenticated user
 * @param href - The route to check
 * @returns true if user can access the route
 */
export function canAccessRoute(user: User | null, href: string): boolean {
  if (!user) return false;

  const userRoleNames = user.roles?.map((role) => role.name) || [];

  // SUPER_ADMIN can access everything
  if (userRoleNames.includes('SUPER_ADMIN')) {
    return true;
  }

  const item = MENU_ITEMS.find((menuItem) => menuItem.href === href);
  if (!item) return true; // If route not in config, allow access

  // If no roles specified, accessible to all authenticated users
  if (!item.allowedRoles || item.allowedRoles.length === 0) {
    return true;
  }

  return item.allowedRoles.some((role) => userRoleNames.includes(role));
}
