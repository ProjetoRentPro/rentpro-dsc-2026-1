import { apiClient } from './apiClient';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get<User[]>('/users');

  return response.data;
}

export async function getUserById(id: number): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);

  return response.data;
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  const response = await apiClient.post<User>('/users', data);

  return response.data;
}

export async function updateUser(id: number, data: UpdateUserRequest): Promise<User> {
  const response = await apiClient.patch<User>(`/users/${id}`, data);

  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
