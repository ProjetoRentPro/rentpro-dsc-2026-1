import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { IEquipmentRepository } from './equipment.repository.interface';

@Injectable()
export class EquipmentTypeORMRepository implements IEquipmentRepository {
  constructor(
    @InjectRepository(Equipment)
    private readonly repository: Repository<Equipment>,
  ) {}

  async create(equipment: Equipment): Promise<Equipment> {
    return this.repository.save(equipment);
  }

  async findById(equipamento_id: number): Promise<Equipment | null> {
    return this.repository.findOne({ where: { equipamento_id } });
  }

  async findAll(): Promise<Equipment[]> {
    return this.repository.find();
  }

  async update(equipment: Equipment): Promise<Equipment> {
    return this.repository.save(equipment);
  }

  async delete(equipamento_id: number): Promise<void> {
    await this.repository.delete({ equipamento_id });
  }
}
