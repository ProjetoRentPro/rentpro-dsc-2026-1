import { StatusEquipamento } from '../enums/status-equipamento.enum';

export class CreateEquipmentDto {
  nome!: string;
  proprietarioId!: string;
  descricao?: string;
  categoria!: string;
  localizacao!: string;
  precoDiaria!: number;
  status?: StatusEquipamento;
}
