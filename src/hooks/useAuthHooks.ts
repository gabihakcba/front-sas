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
    e?.preventDefault();
    setLoading(true);
    setError('');

    let submittedUsername = username;
    let submittedPassword = password;

    if (e?.currentTarget instanceof HTMLFormElement) {
      const formData = new FormData(e.currentTarget);
      const formUsername = formData.get('username');
      const formPassword = formData.get('password');

      if (typeof formUsername === 'string') {
        submittedUsername = formUsername;
      }

      if (typeof formPassword === 'string') {
        submittedPassword = formPassword;
      }
    }

    try {
      const { access_token, user } = await loginRequest({
        user: submittedUsername.trim(),
        password: submittedPassword,
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
