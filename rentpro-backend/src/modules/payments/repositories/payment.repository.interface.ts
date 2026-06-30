import { PaymentEntity } from '../entities/payment.entity';

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

export interface IPaymentRepository {
  create(payment: PaymentEntity): Promise<PaymentEntity>;
  findById(id: string): Promise<PaymentEntity | null>;
  findByReservaId(reservaId: string): Promise<PaymentEntity[]>;
  findAll(): Promise<PaymentEntity[]>;
  update(payment: PaymentEntity): Promise<PaymentEntity>;
  delete(id: string): Promise<void>;
}
