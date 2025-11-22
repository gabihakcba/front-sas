import api from '@/lib/axios';

export interface LoginData {
    user: string;
    password: string;
}

export interface AuthResponse {
    data: {
        access_token: string;
        refresh_token: string;
    };
}

export const loginUserFn = async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
};
