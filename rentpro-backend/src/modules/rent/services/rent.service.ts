import { Inject, Injectable } from '@nestjs/common';
import type { IRentRepository } from '../repositories/rent.repository.interface';
import { RENT_REPOSITORY } from '../repositories/rent.repository.interface';
import { RentModule } from '../rent.module';
import { RentEntity } from '../entities/rent.entity';
import { ConfirmRentResponseDto } from '../dto/confirm-rent-response.dto';
//import { ConfirmRentRequestDto } from '../dto/confirm-rent-request.dto';
import { RentStatus } from '../../../commons/enums/rent-status.enum';

@Injectable()
export class RentService {
  constructor(
    @Inject(RENT_REPOSITORY)
    private readonly rentRepository: IRentRepository,

  ) {}
  
  async ConfirmRent(reservaId: string): Promise<ConfirmRentResponseDto> {
    const Rent = await this.rentRepository.create({ reservaId } as RentEntity);
    if(!Rent){
      throw new Error('Failed to create rent!');
    } 
    return new ConfirmRentResponseDto(Rent.reservaId, RentStatus.CONFIRMED);

  }
}
