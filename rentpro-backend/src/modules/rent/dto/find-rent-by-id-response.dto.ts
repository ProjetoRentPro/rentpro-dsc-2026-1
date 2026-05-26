import { RentEntity } from '../entities/rent.entity';

export class FindRentByIdResponseDto {
  reservaId: string;
  metodo_pagamento: string;
  valor_total: number;
  data_reserva: Date;
  data_devolucao: Date;
  paidAt: Date | null;
  created_at: Date;
  updated_at: Date;

  constructor(rent: RentEntity) {
    this.reservaId = rent.reservaId;
    this.metodo_pagamento = rent.metodo_pagamento;
    this.valor_total = rent.valor_total;
    this.data_reserva = rent.data_reserva;
    this.data_devolucao = rent.data_devolucao;
    this.paidAt = rent.paidAt;
    this.created_at = rent.created_at;
    this.updated_at = rent.updated_at;
  }
}
