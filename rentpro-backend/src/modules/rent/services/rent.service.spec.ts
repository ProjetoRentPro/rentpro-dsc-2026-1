import { Test } from '@nestjs/testing';
import { RentService } from './rent.service';
import type { IRentRepository} from '../repositories/rent.repository.interface';
import {RENT_REPOSITORY} from "../repositories/rent.repository.interface";
import { RentModule } from '../rent.module';
//import { Rent } from '../entities/rent.module';

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

  /*it('should fail when rent does not exist', async () => {
    rentRepository.findById.mockResolvedValue(null);

    await expect(rentService.findById(1)).resolves.toBeNull();
    expect(rentRepository.findById).toHaveBeenCalledWith(1);
  });*/

 /* it('should return a rent when it exists', async () => {
  
    
    
    rentRepository.findById.mockResolvedValue(rent);

    await expect(rentService.findById(1)).resolves.toEqual(rent);
    expect(rentRepository.findById).toHaveBeenCalledWith(1);
  });*/
});