import {
  EQUIPMENT_REPOSITORY,
  type IEquipmentRepository,
} from '../repositories/equipment.repository.interface';
import { BuscarEquipamentoDto } from '../dto/buscar-equipamento.dto';
import { EquipmentResponseDto } from '../dto/equipment-response.dto';
import { EquipmentEntity } from '../entities/equipment.entity';
import { StatusEquipamento } from '../enums/status-equipamento.enum';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class BuscarEquipamentosUseCase {
  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly repository: IEquipmentRepository,
  ) {}

  async execute(
    filtros: BuscarEquipamentoDto,
  ): Promise<EquipmentResponseDto[]> {
    const equipamentos = await this.repository.findByFiltros(filtros);

    // Garantia extra: nunca expõe indisponíveis mesmo que o repositório falhe no filtro
    return equipamentos
      .filter((e) => e.status === StatusEquipamento.DISPONIVEL)
      .map((e) => this.toResponseDto(e));
  }

  private toResponseDto(entity: EquipmentEntity): EquipmentResponseDto {
    const dto = new EquipmentResponseDto();
    dto.id = entity.id;
    dto.nome = entity.nome;
    dto.descricao = entity.descricao;
    dto.categoria = entity.categoria;
    dto.localizacao = entity.localizacao;
    dto.status = entity.status;
    dto.precoDiaria = Number(entity.precoDiaria);
    // proprietarioId: intencionalmente omitido
    return dto;
  }
}
