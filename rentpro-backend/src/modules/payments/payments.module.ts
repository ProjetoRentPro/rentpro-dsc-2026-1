import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentTypeORMRepository } from './repositories/payment-type-orm.repository';
import { PAYMENT_REPOSITORY } from './repositories/payment.repository.interface';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentEntity])],
    providers: [
        {
            provide: PAYMENT_REPOSITORY,
            useClass: PaymentTypeORMRepository,
        },
    ],
    exports: [PAYMENT_REPOSITORY],
})
export class PaymentsModule {}
