# RentPro Equipamentos

Uma plataforma digital completa para gestão de locação de equipamentos de construção. O RentPro centraliza todos os processos de reserva, pagamento e logística em um único ecossistema integrado, eliminando a gestão manual tradicional e proporcionando eficiência operacional para todas as partes envolvidas.

## Sobre o projeto

Plataforma que conecta proprietários de equipamentos a clientes que necessitam de locação temporária de forma segura e eficiente. Aplicada em construção civil, manutenção industrial, projetos residenciais e serviços profissionais temporários.

## Atores do sistema

| Ator | Descrição |
|------|-----------|
| **Locatários (Clientes)** | Buscam, comparam e alugam equipamentos. Visualizam disponibilidade, realizam reservas e acompanham entregas em tempo real. |
| **Locadores (Proprietários)** | Disponibilizam máquinas e equipamentos para locação. Gerenciam catálogo, definem preços e acompanham status das reservas. |
| **Entregadores** | Responsáveis pela logística de transporte e coleta. Recebem roteamentos otimizados e atualizam status de entrega na plataforma. |
| **Administradores** | Controle total sobre as operações. Gerenciam permissões, monitoram métricas, processam disputas e mantêm integridade dos dados. |

## Casos de uso

| # | Caso de Uso | Descrição |
|---|-------------|-----------|
| UC01 | Gerenciar Usuário | Criação de perfil com informações de contato e preferências |
| UC02 | Autenticar no Sistema | Login seguro utilizando autenticação JWT com tokens de acesso |
| UC03 | Cadastrar Equipamento | Proprietários adicionam máquinas ao catálogo com especificações técnicas |
| UC04 | Buscar Equipamentos | Pesquisa por categoria, localização ou características específicas |
| UC05 | Verificar Disponibilidade | Validação de datas e controle de reservas sobrepostas |
| UC06 | Criar Reserva | Iniciação do processo de locação com seleção de itens e datas |
| UC07 | Processar Pagamento | Transação segura via integração com gateway de pagamentos |
| UC08 | Rastrear Entrega | Acompanhamento em tempo real da localização e status da entrega |
| UC09 | Agendar Devolução | Agendamento de coleta do equipamento após término da locação |
| UC10 | Cancelar Reserva | Cancelamento de reserva com políticas de reembolso automáticas |
| UC11 | Registrar Devolução | Confirmação da devolução na data agendada |

## Regras de negócio

| Regra | Descrição |
|-------|-----------|
| **RN01 – Controle de Disponibilidade** | Proibido reservar o mesmo equipamento para datas sobrepostas. O sistema valida automaticamente conflitos de agenda antes de confirmar qualquer reserva. |
| **RN02 – Políticas de Cancelamento** | Reembolso depende da antecedência: mais de 48h = 100%, entre 24-48h = 50%, menos de 24h = sem reembolso. |
| **RN03 – Penalidades** | Multas automáticas para devoluções fora do prazo, calculadas com base na taxa diária multiplicada pelos dias de atraso. |
| **RN04 – Gestão de Danos** | Registro fotográfico e técnico obrigatório em caso de avarias. Documentação gera automaticamente processo de cobrança ao locatário. |
| **RN05 – Segurança** | Senhas com hash bcrypt (custo 12), comunicações via HTTPS obrigatórias. Dados de cartão nunca são armazenados localmente — tokenização via gateway. |

## Stack tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | NestJS v11 (TypeScript) |
| ORM | TypeORM v0.3 |
| Banco de dados | PostgreSQL 15 |
| Autenticação | JWT |
| Testes | Jest + @nestjs/testing |
| Containerização | Docker + Docker Compose |
| Gerenciador de pacotes | pnpm |

## Arquitetura

O backend é organizado em camadas para promover modularidade e separação de responsabilidades:

```
Controller Layer  →  recebe requisições HTTP e valida entrada
Service Layer     →  lógica de negócio e orquestração
Repository Layer  →  acesso aos dados via TypeORM
Entity Layer      →  modelos de domínio
```

Os módulos seguem a estrutura de features do NestJS:

```
rentpro-backend/src/
├── commons/
│   └── enums/               # Enums compartilhados entre módulos
├── modules/
│   ├── users/               # UC01, UC02
│   ├── equipments/          # UC03, UC04
│   ├── rent/                # UC05, UC06, UC09, UC10, UC11
│   └── payments/            # UC07
└── app.module.ts
```

## Modelo de dados

```
USUARIO          EQUIPAMENTO          RESERVA            PAGAMENTO
─────────        ───────────          ───────            ─────────
id (PK)          id (PK)              id (PK)            id (PK)
nome             proprietario_id (FK) usuario_id (FK)    reserva_id (FK, UK)
email (UK)       nome                 equipamento_id (FK) metodo (enum)
senha_hash       categoria            data_inicio        valor
telefone         descricao            data_fim           status (enum)
endereco         preco_diario         valor_total        transacao_id (UK)
tipo (enum)      status (enum)        status (enum)      processado_em
created_at       created_at           pagamento_id (FK)
                                      created_at

ENTREGA
───────
id (PK)
reserva_id (FK)
entregador_id (FK)
status (enum)
latitude / longitude
atualizado_em
```

**Relacionamentos:**
- Usuário 1:N Reservas, 1:N Equipamentos
- Equipamento N:1 Usuário (proprietário), 1:N Reservas
- Reserva N:1 Usuário, N:1 Equipamento, 1:1 Pagamento, 1:1 Entrega

## Contratos de API

### UC06 – Criar Reserva

    POST /reservas
    Content-Type: application/json

    {
      "usuario_id": "uuid",
      "equipamento_id": "uuid",
      "data_prevista": "2026-04-15",
      "data_devolucao": "2026-04-20",
      "quantidade": 1
    }

| Código | Descrição |
|--------|-----------|
| 201 Created | Reserva criada com sucesso |
| 400 Bad Request | Dados inválidos ou equipamento indisponível |
| 404 Not Found | Usuário ou equipamento não encontrado |
| 409 Conflict | Datas sobrepostas com reserva existente |

### UC07 – Processar Pagamento

    POST /pagamentos
    Content-Type: application/json

    {
      "reserva_id": "uuid",
      "metodo": "CARTAO|BOLETO|PIX",
      "valor": 1500.00,
      "dados_pagamento": { ... }
    }

| Código | Descrição |
|--------|-----------|
| 201 Created | Pagamento processado com sucesso |
| 400 Bad Request | Dados de pagamento inválidos |
| 402 Payment Required | Transação recusada pela operadora |
| 404 Not Found | Reserva não encontrada |
| 422 Unprocessable Entity | Valor não corresponde ao da reserva |

### UC08 – Rastrear Entrega

    PATCH /entregas/{id}/status
    Content-Type: application/json

    {
      "status": "EM_PREPARACAO|EM_ROTA|ENTREGUE",
      "localizacao": { "latitude": -23.5505, "longitude": -46.6333 },
      "observacoes": "..."
    }

| Código | Descrição |
|--------|-----------|
| 200 OK | Status atualizado com sucesso |
| 400 Bad Request | Status inválido ou dados incompletos |
| 404 Not Found | Entrega não encontrada |
| 409 Conflict | Transição de status inválida |

## Como executar

**Pré-requisitos:** Docker, Node.js 20+, pnpm

```bash
# Clonar o repositório
git clone https://github.com/ProjetoRentPro/rentpro-dsc-2026-1.git
cd rentpro-dsc-2026-1/rentpro-backend

# Instalar dependências
pnpm install

# Subir o banco de dados
docker compose up -d

# Configurar variáveis de ambiente
cp .env.example .env
# editar .env com DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME

# Iniciar a aplicação
pnpm run start:dev
```

A API estará disponível em `http://localhost:3000`.

## Testes

```bash
# Testes unitários
pnpm run test

# Testes unitários em modo watch
pnpm run test:watch

# Testes E2E
pnpm run test:e2e
```

## Documentação adicional

- [`docs/CONTEXT-UC07-pagamento.md`](docs/CONTEXT-UC07-pagamento.md) — contexto técnico detalhado do UC07 e padrões do projeto para uso com IAs
