"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NotAllowed from "@/components/common/NotAllowed";
import { useAuth } from "@/context/AuthContext";
import { dashboardRouteAccessList } from "@/data/access-control";
import { hasAccessRule } from "@/lib/authorization";

interface DashboardAccessGateProps {
  children: ReactNode;
}

const getMatchingRoute = (pathname: string) =>
  [...dashboardRouteAccessList]
    .sort((left, right) => right.pathPrefix.length - left.pathPrefix.length)
    .find((route) => pathname.startsWith(route.pathPrefix));

export default function DashboardAccessGate({
  children,
}: DashboardAccessGateProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const matchingRoute = getMatchingRoute(pathname);

  if (!matchingRoute) {
    return <>{children}</>;
  }

  if (!hasAccessRule(user?.scopes, matchingRoute.accessRules)) {
    return <NotAllowed />;
  }

  return <>{children}</>;
}
