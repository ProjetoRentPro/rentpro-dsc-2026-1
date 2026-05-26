import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EquipmentService, EQUIPMENT_REPOSITORY } from './equipment.service';
import type { IEquipmentRepository } from '../repositories/equipment.repository.interface';
import { Equipment } from '../entities/equipment.entity';
import { FindEquipmentByIdResponseDto } from '../dto/find-equipment-by-id-response.dto';

describe('EquipmentService', () => {
  let equipmentService: EquipmentService;
  let equipmentRepository: jest.Mocked<IEquipmentRepository>;

  beforeEach(async () => {
    const equipmentRepositoryMock: jest.Mocked<IEquipmentRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        EquipmentService,
        { provide: EQUIPMENT_REPOSITORY, useValue: equipmentRepositoryMock },
      ],
    }).compile();

    equipmentService = module.get(EquipmentService);
    equipmentRepository = module.get(EQUIPMENT_REPOSITORY);
  });

  describe('findById', () => {
    it('should throw NotFoundException when equipment does not exist', async () => {
      equipmentRepository.findById.mockResolvedValue(null);

      await expect(equipmentService.findById(999)).rejects.toThrow(NotFoundException);
      expect(equipmentRepository.findById).toHaveBeenCalledWith(999);
    });

    it('should return FindEquipmentByIdResponseDto when equipment exists', async () => {
      const equipment = new Equipment({
        equipamento_id: 1,
        nome: 'Furadeira',
        proprietario_id: 10,
        descricao: 'Furadeira de impacto',
        categoria: 'Ferramentas',
        preco_diaria: 50.0,
        status: true,
      });
      equipmentRepository.findById.mockResolvedValue(equipment);

      const result = await equipmentService.findById(1);

      expect(result).toBeInstanceOf(FindEquipmentByIdResponseDto);
      expect(result.equipamento_id).toBe(1);
      expect(equipmentRepository.findById).toHaveBeenCalledWith(1);
    });
  });
});
