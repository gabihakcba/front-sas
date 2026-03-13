import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginRequest } from '@/queries/auth';
import { AxiosError } from 'axios';

export const useLoginHook = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { access_token, user } = await loginRequest({
        user: username,
        password: password,
      });

      login(access_token, user);
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Error de conexión con el servidor');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  };
};
