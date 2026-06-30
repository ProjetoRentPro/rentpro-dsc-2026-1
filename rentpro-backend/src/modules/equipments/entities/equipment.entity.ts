import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

@Entity('equipamentos')
export class EquipmentEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'equipamento_id' })
  id!: string;

  @Column({ name: 'proprietario_id', type: 'int' })
  proprietarioId!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao?: string;

  @Column({ name: 'categoria', type: 'varchar', length: 100 })
  categoria!: string;

  @Column({ name: 'localizacao', type: 'varchar', length: 255 })
  localizacao!: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusEquipamento,
    default: StatusEquipamento.DISPONIVEL,
  })
  status!: StatusEquipamento;

  @Column({
    name: 'preco_diaria',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precoDiaria!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  constructor(data?: Partial<EquipmentEntity>) {
    Object.assign(this, data);
  }
}
