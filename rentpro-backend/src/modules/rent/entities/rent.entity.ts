import { deleteMetadata } from "reflect-metadata/no-conflict";

export class Rent {
    constructor(
        public reserva_id: number,
        public metodo_pagamento: string,
        public paidAt : Date | null,
        public valor_total: number,
        public created_at: Date,
        public updated_at: Date,
        public deleteMetadata: Date,
        public data_reserva: Date,
        public data_devolucao: Date,
    ){}
}