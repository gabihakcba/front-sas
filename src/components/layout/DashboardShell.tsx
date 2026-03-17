"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import DashboardAccessGate from "@/components/layout/DashboardAccessGate";
import { useAuth } from "@/context/AuthContext";
import { dashboardSidebarItems } from "@/data/access-control";
import { hasAccessRule } from "@/lib/authorization";
import packageJson from "../../../package.json";

interface DashboardShellProps {
  children: React.ReactNode;
}

function SidebarNavigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: (path: string) => void;
}) {
  const { user } = useAuth();

  const navigationItems = useMemo(() => {
    return dashboardSidebarItems
      .filter((item) => hasAccessRule(user?.scopes, item.accessRules))
      .map((item) => ({
        ...item,
        active: pathname.startsWith(item.path),
      }));
  }, [pathname, user]);

  return (
    <nav className="w-full p-2">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          type="button"
          label={item.label}
          icon={item.icon}
          iconPos="left"
          text
          size="small"
          onClick={() => onNavigate(item.path)}
          className="w-full justify-content-start"
          severity={item.active ? "contrast" : undefined}
        />
      ))}
    </nav>
  );
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const groupName =
    process.env.NEXT_PUBLIC_GRUPO_NOMBRE ?? "Grupo Scout Adalberto O. Lopez 494";
  const appVersion = packageJson.version;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    setSidebarVisible(false);
    router.push("/");
  };

  if (isLoading) {
    return <div className="min-h-screen" />;
  }

  const sidebarHeader = (
    <div className="px-2 py-3">
      <div className="flex items-center gap-3">
        <div className="h-[44px] w-[44px] flex-shrink-0">
          <Image
            src="/scout_logo.png"
            alt={`Logo de ${groupName}`}
            width={480}
            height={480}
            className="h-full w-full object-contain"
            priority
          />
        </div>
        <span className="text-sm font-semibold">{groupName}</span>
      </div>
      <div className="mt-3 border-b border-surface-300" />
    </div>
  );

  return (
    <>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="left"
        className="w-full sm:w-80"
      >
        <div className="p-3">
          {sidebarHeader}
          <SidebarNavigation
            pathname={pathname}
            onNavigate={(path) => {
              router.push(path);
              setSidebarVisible(false);
            }}
          />
          <div className="mt-3">
            <Button
              type="button"
              label="Cerrar sesión"
              icon="pi pi-power-off"
              iconPos="right"
              outlined
              size="small"
              severity="danger"
              onClick={handleLogout}
              className="w-full"
            />
          </div>
          <div className="mt-4 px-2 text-center">
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0 text-sm text-color-secondary"
              onClick={() => {
                router.push("/dashboard/versiones");
                setSidebarVisible(false);
              }}
            >
              Version {appVersion}
            </button>
          </div>
        </div>
      </Sidebar>

      <div className="min-h-screen lg:pl-80">
        <aside className="hidden lg:block lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-80">
          <div className="h-full flex flex-col p-3">
            {sidebarHeader}
            <SidebarNavigation
              pathname={pathname}
              onNavigate={(path) => {
                router.push(path);
                setSidebarVisible(false);
              }}
            />
            <div className="mt-3">
              <Button
                type="button"
                label="Cerrar sesión"
                icon="pi pi-power-off"
                iconPos="right"
                outlined
                size="small"
                severity="danger"
                onClick={handleLogout}
                className="w-full"
              />
            </div>
            <div className="mt-4 px-2 text-center">
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 text-sm text-color-secondary"
                onClick={() => {
                  router.push("/dashboard/versiones");
                  setSidebarVisible(false);
                }}
              >
                Version {appVersion}
              </button>
            </div>
          </div>
        </aside>
        <section className="min-h-screen w-full p-4 lg:p-6">
          <div className="lg:hidden mb-4 flex justify-end">
            <Button
              type="button"
              label="Menú"
              icon="pi pi-bars"
              iconPos="right"
              outlined
              size="small"
              onClick={() => setSidebarVisible(true)}
            />
          </div>
          <DashboardAccessGate>
            <div className="min-h-screen w-full">{children}</div>
          </DashboardAccessGate>
        </section>
      </div>
    </>
  );
}
