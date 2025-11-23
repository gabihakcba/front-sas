/**
 * Página de Gestión de Adultos
 * Ruta: /dashboard/adultos
 */

import { Protect } from '@/components/auth/Protect';
import AdultosList from '@/features/adultos/components/AdultosList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Adultos | SAS',
  description: 'Administración de adultos y educadores del grupo scout',
};

/**
 * Roles autorizados para acceder a este módulo:
 * - SUPER_ADMIN: Acceso total
 * - JEFE_GRUPO: Gestión general del grupo
 * - SECRETARIA: Administración y registros
 * - JEFE_RAMA: Gestión de su rama
 * - COLABORADOR_RAMA: Colaborador de rama
 */
const AUTHORIZED_ROLES = [
  'SUPER_ADMIN',
  'JEFE_GRUPO',
  'SECRETARIA',
  'JEFE_RAMA',
  'COLABORADOR_RAMA',
];

export default function AdultosPage() {
  return (
    <Protect
      roles={AUTHORIZED_ROLES}
      fallback={
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
          <i className="pi pi-lock text-6xl text-gray-400"></i>
          <h2 className="text-2xl font-bold text-gray-300">Acceso Denegado</h2>
          <p className="text-gray-500">
            No tienes permisos para acceder a este módulo.
          </p>
        </div>
      }
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Gestión de Adultos
          </h1>
          <p className="text-gray-400">
            Administra los educadores y colaboradores del grupo scout
          </p>
        </div>

        {/* Lista de Adultos */}
        <AdultosList />
      </div>
    </Protect>
  );
}
