import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MetodoPagamento } from '../../../commons/enums/metodo-pagamento.enum';
import { StatusPagamento } from '../../../commons/enums/status-pagamento.enum';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pagamento_id' })
  id!: string;

  @Column({ name: 'reserva_id', type: 'uuid' })
  reservaId!: string;

  @Column({ name: 'metodo', type: 'enum', enum: MetodoPagamento })
  metodo!: MetodoPagamento;

  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
  valor!: number;

  @Column({ name: 'status', type: 'enum', enum: StatusPagamento })
  status!: StatusPagamento;

  @Column({
    name: 'transacao_id',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  transacaoId!: string | null;

  @Column({ name: 'processado_em', type: 'timestamp', nullable: true })
  processadoEm!: Date | null;

  constructor(data?: Partial<PaymentEntity>) {
    Object.assign(this, data);

    if (this.transacaoId === undefined) {
      this.transacaoId = null;
    }
    if (this.processadoEm === undefined) {
      this.processadoEm = null;
    }
  }
}
