import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { AuthProvider } from '@/context/AuthContext';
import { PrimeReactProvider } from 'primereact/api';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Administración Scout',
  description: 'Gestión eficiente para el Grupo Scout Adalberto O. Lopez',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <PrimeReactProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
