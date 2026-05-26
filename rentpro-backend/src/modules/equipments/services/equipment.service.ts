import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IEquipmentRepository } from '../repositories/equipment.repository.interface';
import { Equipment } from '../entities/equipment.entity';
import { CreateEquipmentDto } from '../dto/create-equipment.dto';
import { UpdateEquipmentDto } from '../dto/update-equipment.dto';
import { FindEquipmentByIdResponseDto } from '../dto/find-equipment-by-id-response.dto';

export const EQUIPMENT_REPOSITORY = 'EQUIPMENT_REPOSITORY';

@Injectable()
export class EquipmentService {
  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: IEquipmentRepository,
  ) {}

  async create(dto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = new Equipment(dto);
    return this.equipmentRepository.create(equipment);
  }

  async findById(id: number): Promise<FindEquipmentByIdResponseDto> {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundException(`Equipment with id ${id} not found`);
    }
    return new FindEquipmentByIdResponseDto(equipment);
  }

  async update(id: number, dto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundException(`Equipment with id ${id} not found`);
    }
    Object.assign(equipment, dto);
    equipment.updated_at = new Date();
    return this.equipmentRepository.update(equipment);
  }

  async delete(id: number): Promise<void> {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundException(`Equipment with id ${id} not found`);
    }
    return this.equipmentRepository.delete(id);
  }
}
