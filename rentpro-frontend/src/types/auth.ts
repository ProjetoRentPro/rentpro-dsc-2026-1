import type { UserRole } from './roles';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  tipo: UserRole;
}
