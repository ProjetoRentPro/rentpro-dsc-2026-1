import {PaymentStatus} from "../../../commons/enums/payment-status.enum";

export class ConfirmPaymentResponseDto {
    constructor(
        public pagamento_id: number,
        public reserva_id: number,
        public transacao_id: number,
        public valor: number,
        public status: PaymentStatus,
        public data_pagamento: Date
    ) {}
}