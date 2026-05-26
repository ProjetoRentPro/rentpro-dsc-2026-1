import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { IPaymentRepository } from '../repositories/payment.repository.interface';
import { PAYMENT_REPOSITORY } from '../repositories/payment.repository.interface';
import { PaymentEntity } from '../entities/payment.entity';
import { FindPaymentByIdResponseDto } from '../dto/find-payment-by-id-response.dto';
import { MetodoPagamento } from '../../../commons/enums/metodo-pagamento.enum';
import { StatusPagamento } from '../../../commons/enums/status-pagamento.enum';

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let paymentRepository: jest.Mocked<IPaymentRepository>;

  beforeEach(async () => {
    const paymentRepositoryMock: jest.Mocked<IPaymentRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findByReservaId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PAYMENT_REPOSITORY, useValue: paymentRepositoryMock },
      ],
    }).compile();

    paymentsService = module.get(PaymentsService);
    paymentRepository = module.get(PAYMENT_REPOSITORY);
  });

  describe('findById', () => {
    it('should throw NotFoundException when payment does not exist', async () => {
      const id = '00000000-0000-0000-0000-000000000000';
      paymentRepository.findById.mockResolvedValue(null);

      await expect(paymentsService.findById(id)).rejects.toThrow(NotFoundException);
      expect(paymentRepository.findById).toHaveBeenCalledWith(id);
    });

    it('should return FindPaymentByIdResponseDto when payment exists', async () => {
      const id = 'abc123ef-0000-0000-0000-000000000001';
      const payment = new PaymentEntity({
        id,
        reservaId: 'reserva-uuid',
        metodo: MetodoPagamento.PIX,
        valor: 150.0,
        status: StatusPagamento.CONFIRMADO,
      });
      paymentRepository.findById.mockResolvedValue(payment);

      const result = await paymentsService.findById(id);

      expect(result).toBeInstanceOf(FindPaymentByIdResponseDto);
      expect(result.id).toBe(id);
      expect(paymentRepository.findById).toHaveBeenCalledWith(id);
    });
  });
});
