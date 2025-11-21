'use client';

import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Image from 'next/image';
import { useLogin } from '@/hooks/queries/useAuthMutation';
import { classNames } from 'primereact/utils';

interface FormData {
  user: string;
  password: string;
}

export default function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      user: '',
      password: '',
    },
  });

  const onSubmit = (data: FormData) => {
    login(data);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/scout.png"
          alt="Scout Logo"
          width={160}
          height={160}
          priority
          className="opacity-90 w-32 h-32 md:w-40 md:h-40 mb-6"
        />
        <h2 className="text-2xl font-bold text-white text-center tracking-wide">
          Adalberto Lopez N° 494
        </h2>
      </div>

      {/* Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-xl">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">
            Ingresa a tu cuenta
          </h1>
          <p className="text-slate-400 text-sm">Bienvenido de vuelta</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-fluid"
        >
          {/* User Field */}
          <div className="space-y-2">
            <label
              htmlFor="user"
              className="block text-sm font-medium text-slate-300"
            >
              Usuario / Correo
            </label>
            <Controller
              name="user"
              control={control}
              rules={{ required: 'El usuario es requerido' }}
              render={({ field, fieldState }) => (
                <InputText
                  id="user"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  ref={field.ref}
                  placeholder="Ingresa tu usuario"
                  className={classNames('w-full', {
                    'p-invalid': fieldState.invalid,
                  })}
                />
              )}
            />
            {errors.user && (
              <p className="text-red-400 text-xs mt-1">{errors.user.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              Contraseña
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              }}
              render={({ field, fieldState }) => (
                <Password
                  id="password"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  inputRef={field.ref}
                  placeholder="••••••••"
                  className={classNames('w-full', {
                    'p-invalid': fieldState.invalid,
                  })}
                  inputClassName="w-full"
                  toggleMask
                  feedback={false}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            label="Iniciar Sesión"
            type="submit"
            className="w-full mt-6"
            loading={isPending}
          />
        </form>
      </div>
    </div>
  );
}
