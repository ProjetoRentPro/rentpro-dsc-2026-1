import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { EquipmentTypeORMRepository } from './repositories/equipment-type-orm.repository';
import { EquipmentService, EQUIPMENT_REPOSITORY } from './services/equipment.service';
import { EquipmentController } from './equipment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment])],
  providers: [
    EquipmentService,
    {
      provide: EQUIPMENT_REPOSITORY,
      useClass: EquipmentTypeORMRepository,
    },
  ],
  controllers: [EquipmentController],
  exports: [EQUIPMENT_REPOSITORY, EquipmentService],
})
export class EquipmentModule {}
