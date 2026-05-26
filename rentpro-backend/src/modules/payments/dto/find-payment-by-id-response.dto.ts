import { PaymentEntity } from '../entities/payment.entity';
import { MetodoPagamento } from '../../../commons/enums/metodo-pagamento.enum';
import { StatusPagamento } from '../../../commons/enums/status-pagamento.enum';

export class FindPaymentByIdResponseDto {
  id: string;
  reservaId: string;
  metodo: MetodoPagamento;
  valor: number;
  status: StatusPagamento;
  transacaoId: string | null;
  processadoEm: Date | null;

  constructor(payment: PaymentEntity) {
    this.id = payment.id;
    this.reservaId = payment.reservaId;
    this.metodo = payment.metodo;
    this.valor = payment.valor;
    this.status = payment.status;
    this.transacaoId = payment.transacaoId;
    this.processadoEm = payment.processadoEm;
  }
}
