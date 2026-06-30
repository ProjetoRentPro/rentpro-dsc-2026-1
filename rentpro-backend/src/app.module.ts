import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentEntity } from './modules/rent/entities/rent.entity';
import { EquipmentEntity } from './modules/equipments/entities/equipment.entity';
import { PaymentEntity } from './modules/payments/entities/payment.entity';
import { UserEntity } from './modules/users/entities/user.entity';
import { RentModule } from './modules/rent/rent.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { EquipmentsModule } from './modules/equipments/equipment.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT', '5432'), 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [RentEntity, EquipmentEntity, PaymentEntity, UserEntity],
        synchronize: true,
      }),
    }),
    RentModule,
    PaymentsModule,
    EquipmentsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
