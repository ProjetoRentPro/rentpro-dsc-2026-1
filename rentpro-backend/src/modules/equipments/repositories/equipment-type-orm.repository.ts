import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, LessThanOrEqual, Repository } from 'typeorm';
import { EquipmentEntity } from '../entities/equipment.entity';
import { IEquipmentRepository } from './equipment.repository.interface';
import { BuscarEquipamentoDto } from '../dto/buscar-equipamento.dto';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

@Injectable()
export class EquipmentTypeORMRepository implements IEquipmentRepository {
  constructor(
    @InjectRepository(EquipmentEntity)
    private readonly repo: Repository<EquipmentEntity>,
  ) {}

  async create(entity: EquipmentEntity): Promise<EquipmentEntity> {
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<EquipmentEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<EquipmentEntity[]> {
    return this.repo.find();
  }

  async update(entity: EquipmentEntity): Promise<EquipmentEntity> {
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  // ── Métodos de busca ────────────────────────────────────────────────────

  async findByCategoria(categoria: string): Promise<EquipmentEntity[]> {
    return this.repo.find({
      where: {
        categoria: ILike(`%${categoria}%`),
        status: StatusEquipamento.DISPONIVEL,
      },
    });
  }

  async findByLocalizacao(localizacao: string): Promise<EquipmentEntity[]> {
    return this.repo.find({
      where: {
        localizacao: ILike(`%${localizacao}%`),
        status: StatusEquipamento.DISPONIVEL,
      },
    });
  }

  async findByFiltros(filtros: BuscarEquipamentoDto): Promise<EquipmentEntity[]> {
    const where: FindOptionsWhere<EquipmentEntity> = {
      status: StatusEquipamento.DISPONIVEL, // ← sempre filtra disponíveis
    };

    if (filtros.categoria) {
      where.categoria = ILike(`%${filtros.categoria}%`);
    }

    if (filtros.localizacao) {
      where.localizacao = ILike(`%${filtros.localizacao}%`);
    }

    if (filtros.precoMaximo !== undefined) {
      where.precoDiaria = LessThanOrEqual(filtros.precoMaximo);
    }

    return this.repo.find({ where });
  }
}