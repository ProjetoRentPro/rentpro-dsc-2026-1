import { RentStatus } from "../../../commons/enums/rent-status.enum";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity('rents')
export class RentEntity {
    @PrimaryGeneratedColumn('uuid', 
        { name: 'reserva_id' })
    reservaId!: string;

    @Column(
        { name: 'metodo_pagamento' })
    metodo_pagamento!: string;

    @Column(
        { name: 'paidAt', type: 'timestamp', nullable: true })
    paidAt!: Date | null;

    @Column(
        { name: 'valor_total', type: 'decimal' })
    valor_total!: number;

    @Column(
        { name: 'created_at', type: 'timestamp' })
    created_at!: Date;

    @Column(
        { name: 'updated_at', type: 'timestamp' })
    updated_at!: Date;

    @Column(
        { name: 'data_reserva', type: 'timestamp' })
    data_reserva!: Date;

    @Column(
        { name: 'data_devolucao', type: 'timestamp' })
    data_devolucao!: Date;

    @Column(
        { name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date | null;

    constructor(data?: Partial<RentEntity>) {
        Object.assign(this, data);

        if (!this.created_at) {
            this.created_at = new Date();
        }
        if (!this.updated_at) {
            this.updated_at = new Date();
        }
        if (!this.deletedAt) {
            this.deletedAt = null;
        }
        if (!this.paidAt) {
            this.paidAt = null;
        }
        if (!this.data_reserva) {
            this.data_reserva = new Date();
        }
        if (!this.data_devolucao) {
            this.data_devolucao = new Date();
        }   
        if (!this.metodo_pagamento) {
            this.metodo_pagamento = '';
        }
        if (!this.valor_total) {
            this.valor_total = 0;
        }
    }
}