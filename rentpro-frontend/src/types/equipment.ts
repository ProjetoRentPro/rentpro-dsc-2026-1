export type EquipmentStatus = 'disponivel' | 'indisponivel';

export interface Equipment {
  id: string;
  proprietarioId: number;
  nome: string;
  descricao?: string;
  categoria: string;
  localizacao: string;
  precoDiaria: number;
  status: EquipmentStatus;
  createdAt: string;
}

export interface CreateEquipmentRequest {
  nome: string;
  proprietarioId: number;
  descricao?: string;
  categoria: string;
  localizacao: string;
  precoDiaria: number;
}

export interface UpdateEquipmentRequest {
  nome?: string;
  descricao?: string;
  categoria?: string;
  localizacao?: string;
  precoDiaria?: number;
  status?: EquipmentStatus;
}
