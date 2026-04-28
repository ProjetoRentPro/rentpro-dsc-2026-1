import {Payment} from "../entities/payment.entity";

export interface IPaymentRepository {
    create(payment: Payment): Promise<Payment>;
    findById(pagamento_id: number): Promise<Payment | null>;
    findAll(): Promise<Payment[]>;
    update(payment: Payment): Promise<Payment>;
    delete(pagamento_id: number): Promise<void>;
}