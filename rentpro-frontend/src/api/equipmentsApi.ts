import { apiClient } from './apiClient';
import type { Equipment, CreateEquipmentRequest, UpdateEquipmentRequest } from '../types/equipment';

export async function getEquipments(): Promise<Equipment[]> {
  const response = await apiClient.get<Equipment[]>('/equipments');

  return response.data;
}

export async function createEquipment(data: CreateEquipmentRequest): Promise<Equipment> {
  const response = await apiClient.post<Equipment>('/equipments', data);

  return response.data;
}

export async function updateEquipment(id: string, data: UpdateEquipmentRequest): Promise<Equipment> {
  const response = await apiClient.patch<Equipment>(`/equipments/${id}`, data);

  return response.data;
}

export async function deleteEquipment(id: string): Promise<void> {
  await apiClient.delete(`/equipments/${id}`);
}
