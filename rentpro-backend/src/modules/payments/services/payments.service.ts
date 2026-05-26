import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from '../repositories/payment.repository.interface';
import type { IPaymentRepository } from '../repositories/payment.repository.interface';
import { PaymentEntity } from '../entities/payment.entity';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { FindPaymentByIdResponseDto } from '../dto/find-payment-by-id-response.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async findById(id: string): Promise<FindPaymentByIdResponseDto> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return new FindPaymentByIdResponseDto(payment);
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    Object.assign(payment, dto);
    return this.paymentRepository.update(payment);
  }
}
