import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipments')
export class Equipment {
    @PrimaryGeneratedColumn({ name: 'equipamento_id' })
    equipamento_id!: number;

    @Column({ name: 'nome', type: 'varchar', length: 255 })
    nome!: string;

    @Column({ name: 'proprietario_id' })
    proprietario_id!: number;

    @Column({ name: 'descricao', type: 'text', nullable: true })
    descricao!: string;

    @Column({ name: 'categoria', type: 'varchar', length: 100 })
    categoria!: string;

    @Column({ name: 'preco_diaria', type: 'decimal', precision: 10, scale: 2 })
    preco_diaria!: number;

    @Column({ name: 'status', type: 'boolean', default: true })
    status!: boolean;

    @Column({ name: 'created_at', type: 'timestamp' })
    created_at!: Date;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updated_at!: Date;

    constructor(data?: Partial<Equipment>) {
        Object.assign(this, data);
        if (!this.created_at) this.created_at = new Date();
        if (!this.updated_at) this.updated_at = new Date();
    }
}