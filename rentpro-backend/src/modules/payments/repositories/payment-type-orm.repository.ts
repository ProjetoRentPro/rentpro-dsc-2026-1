import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { IPaymentRepository } from './payment.repository.interface';

@Injectable()
export class PaymentTypeORMRepository implements IPaymentRepository {
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly repository: Repository<PaymentEntity>,
    ) {}

    async create(payment: PaymentEntity): Promise<PaymentEntity> {
        return this.repository.save(payment);
    }

    async findById(id: string): Promise<PaymentEntity | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findByReservaId(reservaId: string): Promise<PaymentEntity[]> {
        return this.repository.find({ where: { reservaId } });
    }

    async findAll(): Promise<PaymentEntity[]> {
        return this.repository.find();
    }

    async update(payment: PaymentEntity): Promise<PaymentEntity> {
        return this.repository.save(payment);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete({ id });
    }
}
