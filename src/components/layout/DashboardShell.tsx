"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
  { label: "Protagonistas", icon: "pi pi-id-card", path: "/dashboard/protagonistas" },
  { label: "Adultos", icon: "pi pi-users", path: "/dashboard/adultos" },
  { label: "Pagos", icon: "pi pi-wallet", path: "/dashboard/pagos" },
  { label: "Consejos", icon: "pi pi-comments", path: "/dashboard/consejos" },
];

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);

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

  const navigationItems = useMemo(() => {
    return sidebarItems.map((item) => ({
      ...item,
      active: pathname.startsWith(item.path),
    }));
  }, [pathname]);

  if (isLoading) {
    return <div className="min-h-screen" />;
  }

  return (
    <>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="left"
        className="w-full sm:w-80"
      >
        <div className="p-3">
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
                onClick={() => {
                  router.push(item.path);
                  setSidebarVisible(false);
                }}
                className="w-full justify-content-start"
                severity={item.active ? "contrast" : undefined}
              />
            ))}
          </nav>
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
        </div>
      </Sidebar>

      <div className="min-h-screen lg:pl-80">
        <aside className="hidden lg:block lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-80">
          <div className="h-full flex flex-col p-3">
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
                  onClick={() => {
                    router.push(item.path);
                    setSidebarVisible(false);
                  }}
                  className="w-full justify-content-start"
                  severity={item.active ? "contrast" : undefined}
                />
              ))}
            </nav>
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
          <div className="min-h-screen w-full">{children}</div>
        </section>
      </div>
    </>
  );
}
