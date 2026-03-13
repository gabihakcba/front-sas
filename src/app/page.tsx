"use client";

import React from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
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

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card title="Sistema SAS" subTitle="Ingresá con tu usuario del grupo">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username">
                <strong>Usuario</strong>
              </label>
              <div className="p-input-icon-left w-full block">
                <i className="pi pi-user" />
                <InputText
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nombre de usuario"
                  disabled={loading}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">
                <strong>Contraseña</strong>
              </label>
              <div className="w-full">
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  toggleMask
                  feedback={false}
                  placeholder="••••••••"
                  disabled={loading}
                  inputClassName="w-full"
                  className="w-full"
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
