import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IEquipmentRepository } from '../repositories/equipment.repository.interface';
import { EQUIPMENT_REPOSITORY } from '../repositories/equipment.repository.interface';
import { EquipmentEntity } from '../entities/equipment.entity';
import { CreateEquipmentDto } from '../dto/create-equipment.dto';
import { UpdateEquipmentDto } from '../dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: IEquipmentRepository,
  ) {}

  async create(dto: CreateEquipmentDto): Promise<EquipmentEntity> {
    const equipment = new EquipmentEntity({ ...dto });
    return this.equipmentRepository.create(equipment);
  }

  async findById(id: string): Promise<EquipmentEntity> {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundException(`Equipment with id ${id} not found`);
    }
    return equipment;
  }

  async update(id: string, dto: UpdateEquipmentDto): Promise<EquipmentEntity> {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundException(`Equipment with id ${id} not found`);
    }
    Object.assign(equipment, dto);
    return this.equipmentRepository.update(equipment);
  }

  async delete(id: string): Promise<void> {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundException(`Equipment with id ${id} not found`);
    }
    return this.equipmentRepository.delete(id);
  }
}
