import { InjectRepository } from "@nestjs/typeorm";
import { IRentRepository } from "./rent.repository.interface";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { RentEntity } from "../entities/rent.entity";
import { Repository } from "typeorm/browser/repository/Repository.js";

@Injectable()
export class RentTypeORMRepository implements IRentRepository {
  constructor(
    @InjectRepository(RentEntity)
    private readonly repository: Repository<RentEntity>,
  ) {}

  async create(rent: RentEntity): Promise<RentEntity> {
    return await this.repository.save(rent);
  }

  async findById(reserva_id: string): Promise<RentEntity | null> {
    return this.repository.findOne({ 
        where: { reservaId: reserva_id },
    });
  }

  async findAll(): Promise<RentEntity[]> {
    return this.repository.find();
  }

  async update(rent: RentEntity): Promise<RentEntity> {
    return this.repository.save(rent);
  }

  async delete(reserva_id: string): Promise<void> {
    await this.repository.delete({ reservaId: reserva_id });
  }

  async save(rent: RentEntity): Promise<RentEntity> {
    return this.repository.save(rent);
  }
}