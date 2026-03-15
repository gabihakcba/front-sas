"use client";

import React from "react";
import Image from "next/image";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Message } from "primereact/message";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useLoginHook } from "@/hooks/useAuthHooks";

export default function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useLoginHook();
  const groupName =
    process.env.NEXT_PUBLIC_GRUPO_NOMBRE ?? "Grupo Scout Adalberto O. Lopez 494";

  const header = (
    <div className="flex flex-col gap-3 pt-4">
      <div className="flex items-center justify-center gap-3">
        <div className="h-[60px] w-[60px] flex-shrink-0">
          <Image
            src="/scout_logo.png"
            alt={`Logo de ${groupName}`}
            width={480}
            height={480}
            className="h-full w-full object-contain"
            priority
          />
        </div>
        <span className="text-lg font-semibold">{groupName}</span>
      </div>
      <div className="text-center text-xl font-bold">Sistema SAS</div>
    </div>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-10">
      <div className="w-full max-w-md">
        <Card header={header}>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username">
                <strong>Usuario, email o DNI</strong>
              </label>
              <IconField iconPosition="right" className="w-full">
                <InputText
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresá tu usuario, email o DNI"
                  autoComplete="username"
                  disabled={loading}
                  className="w-full"
                />
                <InputIcon className="pi pi-user" />
              </IconField>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">
                <strong>Contraseña</strong>
              </label>
              <div className="w-full p-fluid">
                <Password
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  toggleMask
                  feedback={false}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  inputClassName="w-full"
                  className="w-full"
                  pt={{
                    root: { className: "w-full" },
                    iconField: { className: "w-full" },
                    input: { className: "w-full" },
                  }}
                />
              </div>
            </div>

            {error && <Message severity="error" text={error} />}

            <Button
              type="submit"
              label={loading ? "Verificando..." : "Ingresar"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-arrow-right"}
              iconPos="right"
              outlined
              size="small"
              loading={loading}
            />
          </form>
        </Card>
      </div>
    </main>
  );
}
