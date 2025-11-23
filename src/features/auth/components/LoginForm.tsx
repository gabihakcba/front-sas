'use client';

import Image from 'next/image';
import { useLogin } from '@/hooks/queries/useAuthMutation';
import { GenericForm } from '@/common/components/GenericForm';
import { FieldConfig } from '@/common/types/form';

// 1. Definición de campos (Configuración Pura)
const loginFields: FieldConfig[] = [
  {
    name: 'user',
    label: 'Usuario / Correo',
    type: 'text',
    rules: { required: 'El usuario es requerido' },
    placeholder: 'Ingresa tu usuario',
    icon: 'pi pi-user',
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    rules: {
      required: 'La contraseña es requerida',
      minLength: { value: 6, message: 'Mínimo 6 caracteres' },
    },
    placeholder: '••••••••',
    icon: 'pi pi-lock',
  },
];

export default function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  return (
    <div className="w-full max-w-md">
      {/* Logo y Header (Se mantienen igual de bonitos) */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/scout.png"
          alt="Scout Logo"
          width={160}
          height={160}
          priority
          className="opacity-90 w-32 h-32 md:w-40 md:h-40 mb-6"
        />
        <h2 className="text-2xl font-bold text-text-main text-center tracking-wide">
          Adalberto Lopez N° 494
        </h2>
      </div>

      {/* Card Contenedora */}
      <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-2xl p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-main mb-1">
            Ingresa a tu cuenta
          </h1>
          <p className="text-text-secondary text-sm">Bienvenido de vuelta</p>
        </div>

        {/* 2. Implementación del GenericForm */}
        <GenericForm
          fields={loginFields}
          onSubmit={login}
          isLoading={isPending}
          submitLabel="Iniciar Sesión"
          actionType="login"
        />
      </div>
    </div>
  );
}
