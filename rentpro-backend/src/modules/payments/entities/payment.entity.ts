export class Payment {
    constructor(
        public pagamento_id: number,
        public reserva_id: number,
        public transacao_id: string,
        public valor: number,
        public status: string,
        public data_pagamento: Date,
        public created_at: Date,
        public updated_at: Date
    ) {}
}