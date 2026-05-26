import { Inject, Injectable } from '@nestjs/common';
import type { IRentRepository } from '../repositories/rent.repository.interface';
import { RENT_REPOSITORY } from '../repositories/rent.repository.interface';
import { RentEntity } from '../entities/rent.entity';
import { ConfirmRentResponseDto } from '../dto/confirm-rent-response.dto';
import { FindRentByIdResponseDto } from '../dto/find-rent-by-id-response.dto';
import { UpdateRentDto } from '../dto/update-rent.dto';
import { RentStatus } from '../../../commons/enums/rent-status.enum';
import { RentNotFoundException } from '../../../commons/exceptions/rent-not-found.exception';

@Injectable()
export class RentService {
  constructor(
    @Inject(RENT_REPOSITORY)
    private readonly rentRepository: IRentRepository,
  ) {}

  async ConfirmRent(reservaId: string): Promise<ConfirmRentResponseDto> {
    const Rent = await this.rentRepository.create({ reservaId } as RentEntity);
    if (!Rent) {
      throw new Error('Failed to create rent!');
    }
    return new ConfirmRentResponseDto(Rent.reservaId, RentStatus.CONFIRMED);
  }

  async findById(reservaId: string): Promise<FindRentByIdResponseDto> {
    const rent = await this.rentRepository.findById(reservaId);
    if (!rent) {
      throw new RentNotFoundException(reservaId);
    }
    return new FindRentByIdResponseDto(rent);
  }

  async update(reservaId: string, dto: UpdateRentDto): Promise<RentEntity> {
    const rent = await this.rentRepository.findById(reservaId);
    if (!rent) {
      throw new RentNotFoundException(reservaId);
    }
    Object.assign(rent, dto);
    rent.updated_at = new Date();
    return this.rentRepository.update(rent);
  }
}
