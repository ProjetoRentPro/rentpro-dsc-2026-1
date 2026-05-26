import { MetodoPagamento } from '../../../commons/enums/metodo-pagamento.enum';
import { StatusPagamento } from '../../../commons/enums/status-pagamento.enum';

export class UpdatePaymentDto {
  metodo?: MetodoPagamento;
  valor?: number;
  status?: StatusPagamento;
  transacaoId?: string;
  processadoEm?: Date;
}
