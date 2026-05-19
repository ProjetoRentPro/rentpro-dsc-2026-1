# Contexto: UC07 — Entidade `PaymentEntity` e `IPaymentRepository`

> **Status:** implementado no PR `feat(payments): UC07` — branch `claude/compassionate-poitras-6c240b`

---

## Stack do projeto

**Este projeto usa NestJS + TypeORM (TypeScript), não Java/Spring Boot.**
O enunciado original da issue usa sintaxe Java apenas como referência conceitual.

| Camada | Tecnologia |
|--------|-----------|
| Framework | NestJS v11 (TypeScript) |
| ORM | TypeORM v0.3 |
| Banco | PostgreSQL |
| Testes | Jest + `@nestjs/testing` |
| Gerenciador | pnpm |

---

## Arquivos implementados

| Arquivo | Descrição |
|---------|-----------|
| `rentpro-backend/src/commons/enums/metodo-pagamento.enum.ts` | Enum `MetodoPagamento`: CARTAO, BOLETO, PIX |
| `rentpro-backend/src/commons/enums/status-pagamento.enum.ts` | Enum `StatusPagamento`: PENDENTE, CONFIRMADO, FALHOU, REEMBOLSADO |
| `rentpro-backend/src/modules/payments/entities/payment.entity.ts` | `PaymentEntity` com decorators TypeORM |
| `rentpro-backend/src/modules/payments/repositories/payment.repository.interface.ts` | `IPaymentRepository` com token `PAYMENT_REPOSITORY` |
| `rentpro-backend/src/modules/payments/repositories/payment-type-orm.repository.ts` | Implementação TypeORM da interface |
| `rentpro-backend/src/modules/payments/repositories/payment-type-orm.repository.spec.ts` | 3 testes TDD (todos passando) |
| `rentpro-backend/src/modules/payments/payments.module.ts` | `PaymentsModule` NestJS |

---

## Modelo de persistência (`PaymentEntity`)

| Propriedade TypeScript | Coluna DB | Tipo | Restrição |
|------------------------|-----------|------|-----------|
| `id` | `pagamento_id` | `uuid` (PK) | gerado automaticamente |
| `reservaId` | `reserva_id` | `uuid` | NOT NULL |
| `metodo` | `metodo` | `enum` MetodoPagamento | NOT NULL |
| `valor` | `valor` | `decimal(10,2)` | NOT NULL |
| `status` | `status` | `enum` StatusPagamento | NOT NULL |
| `transacaoId` | `transacao_id` | `varchar(255)` | UNIQUE, nullable |
| `processadoEm` | `processado_em` | `timestamp` | nullable |

⚠️ Nenhum campo de cartão (`numeroCartao`, `cvv`, `titular`) é mapeado como coluna — por design.

---

## Padrões do projeto

### Entidade TypeORM
```typescript
@Entity('nome_tabela')
export class MinhaEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'coluna_id' })
    propriedadeId!: string;

    @Column({ name: 'coluna_db', type: 'decimal', precision: 10, scale: 2 })
    propriedade!: number;

    @Column({ name: 'coluna_enum', type: 'enum', enum: MeuEnum })
    status!: MeuEnum;

    constructor(data?: Partial<MinhaEntity>) {
        Object.assign(this, data);
    }
}
```

### Interface de repositório + token de injeção
```typescript
export const MEU_REPOSITORY = 'MEU_REPOSITORY';

export interface IMeuRepository {
    create(entity: MinhaEntity): Promise<MinhaEntity>;
    findById(id: string): Promise<MinhaEntity | null>;
    findAll(): Promise<MinhaEntity[]>;
    update(entity: MinhaEntity): Promise<MinhaEntity>;
    delete(id: string): Promise<void>;
}
```

### Implementação TypeORM
```typescript
@Injectable()
export class MeuTypeORMRepository implements IMeuRepository {
    constructor(
        @InjectRepository(MinhaEntity)
        private readonly repository: Repository<MinhaEntity>,
    ) {}

    async create(entity: MinhaEntity): Promise<MinhaEntity> {
        return this.repository.save(entity);
    }

    async findById(id: string): Promise<MinhaEntity | null> {
        return this.repository.findOne({ where: { id } });
    }
    // ...
}
```

### Módulo NestJS
```typescript
@Module({
    imports: [TypeOrmModule.forFeature([MinhaEntity])],
    providers: [{ provide: MEU_REPOSITORY, useClass: MeuTypeORMRepository }],
    exports: [MEU_REPOSITORY],
})
export class MeuModule {}
```

### Testes com mock de repositório
```typescript
describe('MeuRepositorio', () => {
    let repository: jest.Mocked<IMeuRepository>;

    beforeEach(async () => {
        const mock: jest.Mocked<IMeuRepository> = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module = await Test.createTestingModule({
            providers: [{ provide: MEU_REPOSITORY, useValue: mock }],
        }).compile();

        repository = module.get(MEU_REPOSITORY);
    });

    it('deve...', async () => { /* ... */ });
});
```

### Enums
```typescript
// src/commons/enums/meu-status.enum.ts
export enum MeuStatus {
    VALOR_A = 'valor_a',
    VALOR_B = 'valor_b',
}
```

---

## Adaptação Java → NestJS (referência para outros UCs)

| Java (enunciado) | NestJS (projeto real) |
|---|---|
| `@DataJpaTest` | `Test.createTestingModule()` com mock |
| `JpaRepository<Entidade, UUID>` | `Repository<MinhaEntity>` via `@InjectRepository` |
| `@NotNull`, `@Positive` (Bean Validation) | `@IsNotEmpty()`, `@IsPositive()` do `class-validator` |
| Migration SQL (Flyway/Liquibase) | `synchronize: true` no TypeORM (sem arquivos de migration) |
| `findByReservaId` (gerado automaticamente) | Método explícito: `repository.find({ where: { reservaId } })` |
| `UUID.randomUUID()` | `crypto.randomUUID()` |

---

## Comandos úteis

```bash
# Rodar todos os testes unitários
pnpm run test

# Rodar testes de um arquivo específico
pnpm run test -- payment-type-orm.repository.spec

# Subir o banco (PostgreSQL via Docker)
docker compose up -d

# Subir a aplicação (cria tabelas via synchronize)
pnpm run start:dev
```

---

## Referências no código

| O que buscar | Arquivo |
|---|---|
| Padrão de entidade TypeORM | `rentpro-backend/src/modules/rent/entities/rent.entity.ts` |
| Padrão de interface + token | `rentpro-backend/src/modules/rent/repositories/rent.repository.interface.ts` |
| Padrão de implementação TypeORM | `rentpro-backend/src/modules/rent/repositories/rent-type-orm.repository.ts` |
| Padrão de teste com mock | `rentpro-backend/src/modules/payments/repositories/payment-type-orm.repository.spec.ts` |
| Padrão de enum | `rentpro-backend/src/commons/enums/metodo-pagamento.enum.ts` |
| Registro de entidades | `rentpro-backend/src/app.module.ts` |
