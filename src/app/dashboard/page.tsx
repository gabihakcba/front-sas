"use client";

import React, { useEffect } from "react";
import { Card } from "primereact/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card title={`Bienvenido, ${user.user}`}>
        <p className="mb-6">
          Panel de Administración del Grupo Scout Adalberto O. Lopez.
        </p>
        
        <div>
          <h3 className="flex items-center gap-2">
            <i className="pi pi-shield"></i>
            Roles
          </h3>
          <Divider />
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <Tag key={role} value={role} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
