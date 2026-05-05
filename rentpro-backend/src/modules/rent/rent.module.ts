import { TypeOrmModule } from "@nestjs/typeorm";
import { RentEntity } from "./entities/rent.entity";
import {RentService} from "./services/rent.service";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { RENT_REPOSITORY } from "./repositories/rent.repository.interface";
import { RentTypeORMRepository } from "./repositories/rent-type-orm.repository";
import { RentController } from "./rent.controller";

@Module({
    imports: [TypeOrmModule.forFeature([RentEntity])],
    providers: [
        RentService,{
            provide: 'RENT_REPOSITORY',
            useClass: RentTypeORMRepository,
        }
    ],
    controllers:[RentController],
    exports: [RENT_REPOSITORY, RentService],
})
export class RentModule {}