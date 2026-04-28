import {Equipment} from "../entities/equipment.entity";

export interface IEquipmentRepository {
    create(equipment: Equipment): Promise<Equipment>;
    findById(equipamento_id: number): Promise<Equipment | null>;
    findAll(): Promise<Equipment[]>;
    update(equipment: Equipment): Promise<Equipment>;
    delete(equipamento_id: number): Promise<void>;
}