import { Test } from '@nestjs/testing';
import { RentService } from './rent.service';
import type { IRentRepository } from '../repositories/rent.repository.interface';
import { RENT_REPOSITORY } from '../repositories/rent.repository.interface';
import { RentEntity } from '../entities/rent.entity';
import { FindRentByIdResponseDto } from '../dto/find-rent-by-id-response.dto';
import { RentNotFoundException } from '../../../commons/exceptions/rent-not-found.exception';

describe('RentService', () => {
  let rentService: RentService;
  let rentRepository: jest.Mocked<IRentRepository>;

  beforeEach(async () => {
    const rentRepositoryMock: jest.Mocked<IRentRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        RentService,
        { provide: RENT_REPOSITORY, useValue: rentRepositoryMock },
      ],
    }).compile();

    rentService = module.get(RentService);
    rentRepository = module.get(RENT_REPOSITORY);
  });

  describe('findById', () => {
    it('should throw RentNotFoundException when rent does not exist', async () => {
      const reservaId = '00000000-0000-0000-0000-000000000000';
      rentRepository.findById.mockResolvedValue(null);

      await expect(rentService.findById(reservaId)).rejects.toThrow(RentNotFoundException);
      expect(rentRepository.findById).toHaveBeenCalledWith(reservaId);
    });

    it('should return FindRentByIdResponseDto when rent exists', async () => {
      const reservaId = 'abc123ef-0000-0000-0000-000000000001';
      const rent = new RentEntity({ reservaId });
      rentRepository.findById.mockResolvedValue(rent);

      const result = await rentService.findById(reservaId);

      expect(result).toBeInstanceOf(FindRentByIdResponseDto);
      expect(result.reservaId).toBe(reservaId);
      expect(rentRepository.findById).toHaveBeenCalledWith(reservaId);
    });
  });
});