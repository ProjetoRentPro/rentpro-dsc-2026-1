import { Inject, Injectable } from '@nestjs/common';
import type { IRentRepository } from '../repositories/rent.repository.interface';
import { RENT_REPOSITORY } from '../repositories/rent.repository.interface';
import { Rent } from '../entities/rent.entity';

@Injectable()
export class RentService {
  constructor(
    @Inject(RENT_REPOSITORY)
    private readonly rentRepository: IRentRepository,
  ) {}

  findById(reserva_id: number): Promise<Rent | null> {
    return this.rentRepository.findById(reserva_id);
  }
}
