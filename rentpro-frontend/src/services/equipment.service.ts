const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface Equipment {
  id: string;
  proprietarioId: number;
  nome: string;
  descricao?: string;
  categoria: string;
  localizacao: string;
  precoDiaria: number;
  status: 'disponivel' | 'indisponivel';
  createdAt: string;
}

export interface CreateEquipmentPayload {
  nome: string;
  proprietarioId: number;
  descricao?: string;
  categoria: string;
  localizacao: string;
  precoDiaria: number;
}

export interface UpdateEquipmentPayload {
  nome?: string;
  descricao?: string;
  categoria?: string;
  localizacao?: string;
  precoDiaria?: number;
  status?: 'disponivel' | 'indisponivel';
}

async function request<T>(path: string, options: RequestInit, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
}

export const equipmentService = {
  findAll(token: string) {
    return request<Equipment[]>('/v1/equipments', { method: 'GET' }, token);
  },

  create(payload: CreateEquipmentPayload, token: string) {
    return request<Equipment>('/v1/equipments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token);
  },

  update(id: string, payload: UpdateEquipmentPayload, token: string) {
    return request<Equipment>(`/v1/equipments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }, token);
  },

  remove(id: string, token: string) {
    return request<void>(`/v1/equipments/${id}`, { method: 'DELETE' }, token);
  },
};
