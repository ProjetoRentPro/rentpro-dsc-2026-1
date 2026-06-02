import { EquipmentEntity } from '../entities/equipment.entity';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

export class FindEquipmentByIdResponseDto {
  id: string;
  nome: string;
  proprietarioId: string;
  descricao?: string;
  categoria: string;
  localizacao: string;
  precoDiaria: number;
  status: StatusEquipamento;
  createdAt: Date;

  constructor(equipment: EquipmentEntity) {
    this.id = equipment.id;
    this.nome = equipment.nome;
    this.proprietarioId = equipment.proprietarioId;
    this.descricao = equipment.descricao;
    this.categoria = equipment.categoria;
    this.localizacao = equipment.localizacao;
    this.precoDiaria = equipment.precoDiaria;
    this.status = equipment.status;
    this.createdAt = equipment.createdAt;
  }
}
