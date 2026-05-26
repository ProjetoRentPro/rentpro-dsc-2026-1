import { Equipment } from '../entities/equipment.entity';

export class FindEquipmentByIdResponseDto {
  equipamento_id: number;
  nome: string;
  proprietario_id: number;
  descricao: string;
  categoria: string;
  preco_diaria: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(equipment: Equipment) {
    this.equipamento_id = equipment.equipamento_id;
    this.nome = equipment.nome;
    this.proprietario_id = equipment.proprietario_id;
    this.descricao = equipment.descricao;
    this.categoria = equipment.categoria;
    this.preco_diaria = equipment.preco_diaria;
    this.status = equipment.status;
    this.created_at = equipment.created_at;
    this.updated_at = equipment.updated_at;
  }
}
