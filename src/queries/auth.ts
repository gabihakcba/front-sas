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
    console.log(data);
    const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
};
