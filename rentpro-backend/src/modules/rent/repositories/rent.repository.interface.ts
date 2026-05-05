import {RentEntity} from "../entities/rent.entity";

export const RENT_REPOSITORY = 'RENT_REPOSITORY';

export interface IRentRepository {
    create(rent: RentEntity): Promise<RentEntity>;
    findById(reserva_id: string): Promise<RentEntity | null>;
    findAll(): Promise<RentEntity[]>;
    update(rent: RentEntity): Promise<RentEntity>;
    delete(reserva_id: string): Promise<void>;
}