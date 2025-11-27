export interface LoginCredentials {
  user: string;
  password: string;
}

export interface LoginResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
  message?: string;
}
