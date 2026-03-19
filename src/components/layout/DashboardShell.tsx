"use client";

import React, { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import DashboardAccessGate from "@/components/layout/DashboardAccessGate";
import { useAuth } from "@/context/AuthContext";
import { resolveBrandingAssetUrl, useBranding } from "@/context/BrandingContext";
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
  const { branding } = useBranding();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const groupName = branding.nombre_grupo;
  const groupLogo = resolveBrandingAssetUrl(branding.url_logo, "/logo.png");
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

  const handleNavigate = (path: string) => {
    setSidebarVisible(false);
    startTransition(() => {
      router.push(path);
      router.refresh();
    });
  };

  if (isLoading) {
    return <div className="min-h-screen" />;
  }

  const sidebarHeader = (
    <div className="w-full px-2 py-1">
      <div className="flex items-center gap-3">
        <div className="h-[44px] w-[44px] flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={groupLogo}
            alt={`Logo de ${groupName}`}
            className="h-full w-full object-contain"
          />
        </div>
        <span className="text-sm font-semibold">{groupName}</span>
      </div>
    </div>
  );

  return (
    <>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="left"
        className="w-full sm:w-80"
        header={sidebarHeader}
        pt={{
          root: {
            style: { background: "var(--surface-section)" },
          },
          header: {
            style: { background: "var(--surface-section)" },
          },
          content: {
            style: { background: "var(--surface-section)" },
          },
        }}
      >
        <div className="p-3">
          <SidebarNavigation
            pathname={pathname}
            onNavigate={handleNavigate}
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
                handleNavigate("/dashboard/versiones");
              }}
            >
              Version {appVersion}
            </button>
          </div>
        </div>
      </Sidebar>

      <div
        className="min-h-screen lg:pl-80"
        style={{ background: "var(--surface-ground)" }}
      >
        <aside
          className="hidden lg:block lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-80"
          style={{ background: "var(--surface-section)" }}
        >
          <div className="h-full flex flex-col p-3">
            {sidebarHeader}
            <div className="mt-3 border-b border-surface-300" />
            <SidebarNavigation
              pathname={pathname}
              onNavigate={handleNavigate}
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
                  handleNavigate("/dashboard/versiones");
                }}
              >
                Version {appVersion}
              </button>
            </div>
          </div>
        </aside>
        <section
          className="min-h-screen w-full p-4 lg:p-6"
          style={{ background: "var(--surface-ground)" }}
        >
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
            <div
              className="min-h-screen w-full"
              style={{ background: "var(--surface-ground)" }}
            >
              {children}
            </div>
          </DashboardAccessGate>
        </section>
      </div>
    </>
  );
}
