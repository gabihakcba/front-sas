"use client";

import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

interface NotAllowedProps {
  title?: string;
  message?: string;
}

export default function NotAllowed({
  title = "Sin acceso",
  message = "Tu cuenta no tiene permisos para ver esta seccion.",
}: NotAllowedProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card title={title} className="w-full max-w-2xl">
        <div className="flex flex-col gap-3">
          <p className="m-0">{message}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              label="Ir a perfil"
              icon="pi pi-user"
              iconPos="right"
              outlined
              size="small"
              onClick={() => router.push("/dashboard/perfil")}
            />
            <Button
              type="button"
              label="Volver"
              icon="pi pi-arrow-left"
              iconPos="right"
              outlined
              size="small"
              onClick={() => router.back()}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
