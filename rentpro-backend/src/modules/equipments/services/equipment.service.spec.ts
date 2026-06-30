import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EQUIPMENT_REPOSITORY } from '../repositories/equipment.repository.interface';
import type { IEquipmentRepository } from '../repositories/equipment.repository.interface';
import { EquipmentEntity } from '../entities/equipment.entity';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

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
      findByCategoria: jest.fn(),
      findByLocalizacao: jest.fn(),
      findByFiltros: jest.fn(),
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

      await expect(equipmentService.findById('uuid-999')).rejects.toThrow(
        NotFoundException,
      );
      expect(equipmentRepository.findById).toHaveBeenCalledWith('uuid-999');
    });

    it('should return EquipmentEntity when equipment exists', async () => {
      const equipment = new EquipmentEntity({
        id: 'uuid-1',
        nome: 'Furadeira',
        proprietarioId: 1,
        descricao: 'Furadeira de impacto',
        categoria: 'Ferramentas',
        precoDiaria: 50.0,
        status: StatusEquipamento.DISPONIVEL,
      });
      equipmentRepository.findById.mockResolvedValue(equipment);

      const result = await equipmentService.findById('uuid-1');

      expect(result).toBeInstanceOf(EquipmentEntity);
      expect(result.id).toBe('uuid-1');
      expect(equipmentRepository.findById).toHaveBeenCalledWith('uuid-1');
    });
  });
});
