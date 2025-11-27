'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';

export default function MasOpcionesPage() {
  const router = useRouter();

  const options = [
    {
      title: 'Conceptos de Pago',
      icon: 'pi pi-tags',
      description: 'Gestión de conceptos y tipos de pago',
      href: '/dashboard/mas-opciones/conceptos',
      color: 'text-blue-500',
    },
    {
      title: 'Métodos de Pago',
      icon: 'pi pi-credit-card',
      description: 'Gestión de formas de pago aceptadas',
      href: '/dashboard/mas-opciones/metodos',
      color: 'text-green-500',
    },
    {
      title: 'Cuentas de Dinero',
      icon: 'pi pi-building-columns',
      description: 'Gestión de cuentas y cajas',
      href: '/dashboard/mas-opciones/cuentas',
      color: 'text-yellow-500',
    },
    // Future options can be added here
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-100">Más Opciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => router.push(option.href)}
            className="cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Card className="h-full border-l-4 border-l-blue-500 bg-slate-800 text-slate-100">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full bg-slate-700 ${option.color}`}
                >
                  <i className={`${option.icon} text-xl`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{option.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
