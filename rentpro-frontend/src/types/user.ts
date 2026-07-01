import type { UserRole } from './roles';

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo: UserRole;
  createdAt?: string;
}

export interface CreateUserRequest {
  nome: string;
  email: string;
  senha: string;
  tipo: UserRole;
}

export interface UpdateUserRequest {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: UserRole;
}
