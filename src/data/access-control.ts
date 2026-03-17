import type { AccessRule } from "@/lib/authorization";

export interface DashboardRouteAccess {
  pathPrefix: string;
  accessRules: AccessRule[];
}

export interface DashboardSidebarItem {
  label: string;
  icon: string;
  path: string;
  accessRules: AccessRule[];
}

export const GROUP_LEADERSHIP_ACCESS: AccessRule[] = [
  { role: "JEFATURA" },
];

export const BRANCH_LEADERSHIP_ACCESS: AccessRule[] = [
  { role: "JEFATURA_RAMA", scopeType: "RAMA" },
];

export const BRANCH_ADULT_ACCESS: AccessRule[] = [
  { role: "JEFATURA" },
  { role: "JEFATURA_RAMA", scopeType: "RAMA" },
  { role: "AYUDANTE_RAMA", scopeType: "RAMA" },
];

export const BRANCH_RESPONSABLE_ACCESS: AccessRule[] = [
  { role: "JEFATURA" },
  { role: "JEFATURA_RAMA", scopeType: "RAMA" },
  { role: "AYUDANTE_RAMA", scopeType: "RAMA" },
];

export const BRANCH_PAYMENT_ACCESS: AccessRule[] = [
  { role: "JEFATURA" },
  { role: "JEFATURA_RAMA", scopeType: "RAMA" },
  { role: "AYUDANTE_RAMA", scopeType: "RAMA" },
];

export const BRANCH_CASH_ACCOUNT_ACCESS: AccessRule[] = [
  { role: "JEFATURA" },
  { role: "JEFATURA_RAMA", scopeType: "RAMA" },
  { role: "AYUDANTE_RAMA", scopeType: "RAMA" },
];

export const BRANCH_EVENT_ACCESS: AccessRule[] = [
  { role: "JEFATURA" },
  { role: "JEFATURA_RAMA", scopeType: "RAMA" },
  { role: "AYUDANTE_RAMA", scopeType: "RAMA" },
];

export const DASHBOARD_MANAGEMENT_ACCESS: AccessRule[] = [
  ...GROUP_LEADERSHIP_ACCESS,
  ...BRANCH_LEADERSHIP_ACCESS,
];

export const dashboardSidebarItems: DashboardSidebarItem[] = [
  {
    label: "Perfil",
    icon: "pi pi-user",
    path: "/dashboard/perfil",
    accessRules: [],
  },
  {
    label: "Protagonistas",
    icon: "pi pi-id-card",
    path: "/dashboard/protagonistas",
    accessRules: DASHBOARD_MANAGEMENT_ACCESS,
  },
  {
    label: "Adultos",
    icon: "pi pi-users",
    path: "/dashboard/adultos",
    accessRules: BRANCH_ADULT_ACCESS,
  },
  {
    label: "Responsables",
    icon: "pi pi-user-edit",
    path: "/dashboard/responsables",
    accessRules: BRANCH_RESPONSABLE_ACCESS,
  },
  {
    label: "Pagos",
    icon: "pi pi-wallet",
    path: "/dashboard/pagos",
    accessRules: BRANCH_PAYMENT_ACCESS,
  },
  {
    label: "Eventos",
    icon: "pi pi-calendar",
    path: "/dashboard/eventos",
    accessRules: BRANCH_EVENT_ACCESS,
  },
  {
    label: "Formaciones",
    icon: "pi pi-book",
    path: "/dashboard/formaciones",
    accessRules: [],
  },
  {
    label: "Comisiones",
    icon: "pi pi-briefcase",
    path: "/dashboard/comisiones",
    accessRules: BRANCH_EVENT_ACCESS,
  },
  {
    label: "Consejos",
    icon: "pi pi-comments",
    path: "/dashboard/consejos",
    accessRules: [],
  },
  {
    label: "Calendario",
    icon: "pi pi-calendar-clock",
    path: "/dashboard/calendario",
    accessRules: [],
  },
];

export const dashboardRouteAccessList: DashboardRouteAccess[] = [
  { pathPrefix: "/dashboard/perfil/", accessRules: DASHBOARD_MANAGEMENT_ACCESS },
  { pathPrefix: "/dashboard/protagonistas", accessRules: DASHBOARD_MANAGEMENT_ACCESS },
  { pathPrefix: "/dashboard/adultos", accessRules: BRANCH_ADULT_ACCESS },
  { pathPrefix: "/dashboard/responsables", accessRules: BRANCH_RESPONSABLE_ACCESS },
  { pathPrefix: "/dashboard/pagos", accessRules: BRANCH_PAYMENT_ACCESS },
  {
    pathPrefix: "/dashboard/conceptos-pago",
    accessRules: BRANCH_PAYMENT_ACCESS,
  },
  {
    pathPrefix: "/dashboard/metodos-pago",
    accessRules: BRANCH_PAYMENT_ACCESS,
  },
  {
    pathPrefix: "/dashboard/cuentas-dinero",
    accessRules: DASHBOARD_MANAGEMENT_ACCESS,
  },
  { pathPrefix: "/dashboard/eventos", accessRules: BRANCH_EVENT_ACCESS },
  {
    pathPrefix: "/dashboard/tipos-evento",
    accessRules: BRANCH_EVENT_ACCESS,
  },
  { pathPrefix: "/dashboard/formaciones", accessRules: [] },
  { pathPrefix: "/dashboard/comisiones", accessRules: BRANCH_EVENT_ACCESS },
  { pathPrefix: "/dashboard/consejos", accessRules: [] },
  { pathPrefix: "/dashboard/calendario", accessRules: [] },
  { pathPrefix: "/dashboard/relaciones", accessRules: DASHBOARD_MANAGEMENT_ACCESS },
  { pathPrefix: "/dashboard/perfil", accessRules: [] },
  { pathPrefix: "/dashboard/versiones", accessRules: [] },
  { pathPrefix: "/dashboard", accessRules: [] },
];
