const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  tipo: 'cliente' | 'admin';
}

export interface AuthResponse {
  access_token: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const data = await res.json();
  if (!res.ok) throw data as ApiError;
  return data as T;
}

export const authService = {
  login(payload: LoginPayload) {
    return request<AuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register(payload: RegisterPayload) {
    return request<{ id: number; email: string }>('/v1/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
