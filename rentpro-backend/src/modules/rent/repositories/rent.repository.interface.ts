import {Rent} from "../entities/rent.entity";

export const RENT_REPOSITORY = 'RENT_REPOSITORY';

export interface IRentRepository {
    create(rent: Rent): Promise<Rent>;
    findById(reserva_id: number): Promise<Rent | null>;
    findAll(): Promise<Rent[]>;
    update(rent: Rent): Promise<Rent>;
    delete(reserva_id: number): Promise<void>;
}