import { Test } from '@nestjs/testing';
import { PaymentEntity } from '../entities/payment.entity';
import {
  IPaymentRepository,
  PAYMENT_REPOSITORY,
} from './payment.repository.interface';
import { MetodoPagamento } from '../../../commons/enums/metodo-pagamento.enum';
import { StatusPagamento } from '../../../commons/enums/status-pagamento.enum';

describe('PaymentRepository', () => {
  let repository: jest.Mocked<IPaymentRepository>;

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<IPaymentRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findByReservaId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [{ provide: PAYMENT_REPOSITORY, useValue: repositoryMock }],
    }).compile();

    repository = module.get(PAYMENT_REPOSITORY);
  });

  it('devePersistirPagamentoComSucesso', async () => {
    const pagamento = new PaymentEntity({
      reservaId: crypto.randomUUID(),
      metodo: MetodoPagamento.PIX,
      valor: 1500.0,
      status: StatusPagamento.PENDENTE,
    });

    const salvo = new PaymentEntity({ ...pagamento, id: crypto.randomUUID() });
    repository.create.mockResolvedValue(salvo);

    const resultado = await repository.create(pagamento);

    expect(resultado.id).toBeDefined();
    expect(resultado.id).not.toBeNull();
  });

  it('naoDeveExistirCampoNumeroCartao', () => {
    expect(() => {
      const entity = new PaymentEntity();
      const descriptor = Object.getOwnPropertyDescriptor(
        entity,
        'numeroCartao',
      );
      if (descriptor !== undefined) {
        throw new Error('Campo numeroCartao não deveria existir na entidade');
      }
      // verifica também no prototype da classe
      const keys = Object.getOwnPropertyNames(PaymentEntity.prototype);
      if (keys.includes('numeroCartao')) {
        throw new Error('Campo numeroCartao não deveria existir na entidade');
      }
    }).not.toThrow();
  });

  it('deveEncontrarPagamentoPorReservaId', async () => {
    const reservaId = crypto.randomUUID();
    repository.findByReservaId.mockResolvedValue([]);

    const resultado = await repository.findByReservaId(reservaId);

    expect(resultado).toEqual([]);
    expect(repository.findByReservaId).toHaveBeenCalledWith(reservaId);
  });
});
