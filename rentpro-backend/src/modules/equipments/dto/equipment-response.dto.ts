import { StatusEquipamento } from '../enums/status-equipamento.enum';

export class EquipmentResponseDto {
  id!: string;
  nome!: string;
  descricao?: string;
  categoria!: string;
  localizacao!: string;
  status!: StatusEquipamento;
  precoDiaria!: number;

  // ⚠️ proprietarioId intencionalmente omitido da resposta pública
}