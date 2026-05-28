import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentEntity } from './entities/equipment.entity';
import { EquipmentController } from './equipment.controller';
import { BuscarEquipamentosUseCase } from './use-cases/buscar-equipamentos.use-case';
import { EQUIPMENT_REPOSITORY } from './repositories/equipment.repository.interface';
import { EquipmentTypeORMRepository } from './repositories/equipment-type-orm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentEntity])],
  controllers: [EquipmentController],
  providers: [
    BuscarEquipamentosUseCase,
    {
      provide: EQUIPMENT_REPOSITORY,
      useClass: EquipmentTypeORMRepository,
    },
  ],
  exports: [BuscarEquipamentosUseCase, EQUIPMENT_REPOSITORY],
})
export class EquipmentsModule {}