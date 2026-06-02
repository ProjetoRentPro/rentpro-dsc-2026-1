import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../../commons/enums/user-role.enum';

@Entity('usuarios')
export class UserEntity {
  @PrimaryGeneratedColumn('increment', { name: 'user_id' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255 })
  senhaHash!: string;

  @Column({
    name: 'tipo',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENTE,
  })
  tipo!: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  constructor(data?: Partial<UserEntity>) {
    Object.assign(this, data);
  }
}
