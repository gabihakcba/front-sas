export interface RoleScope {
  role: string;
  scopeType: string;
  scopeId: number | null;
}

export interface User {
  id: number;
  user: string;
  memberId: number | null;
  roles: string[];
  permissions: string[];
  scopes: RoleScope[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginDto {
  user: string;
  password: string;
}
