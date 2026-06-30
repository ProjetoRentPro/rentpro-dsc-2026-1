import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentTypeORMRepository } from './repositories/payment-type-orm.repository';
import { PAYMENT_REPOSITORY } from './repositories/payment.repository.interface';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    PaymentsService,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentTypeORMRepository,
    },
  ],
  controllers: [PaymentsController],
  exports: [PAYMENT_REPOSITORY, PaymentsService],
})
export class PaymentsModule {}
