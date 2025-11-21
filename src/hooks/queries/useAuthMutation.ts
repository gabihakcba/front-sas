import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/providers/ToastProvider';
import { loginUserFn, LoginData } from '@/queries/auth';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/axios';
import { parseJwt } from '@/lib/utils';

export const useLogin = () => {
    const router = useRouter();
    const { setUser } = useAuth();
    const { showSuccessToast, showErrorToast } = useToast();

    return useMutation({
        mutationFn: (data: LoginData) => loginUserFn(data),
        onSuccess: (response) => {
            const { access_token, refresh_token } = response.data;

            // Save tokens
            localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
            localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);

            // Update context
            const decoded = parseJwt(access_token);
            setUser(decoded);

            // Show success message
            showSuccessToast('Bienvenido', 'Inicio de sesión exitoso');

            // Redirect
            router.push('/dashboard');
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || 'Error al iniciar sesión';
            console.log(error.response);
            showErrorToast('Error', Array.isArray(msg) ? msg.join(', ') : msg);
        },
    });
};
