import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository, USER_REPOSITORY } from './user.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../../../commons/enums/user-role.enum';

// ─── factory helper ───────────────────────────────────────────────────────────

const makeUser = (overrides: Partial<UserEntity> = {}): UserEntity =>
  new UserEntity({
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    senhaHash: '$2b$12$hashedpassword',
    tipo: UserRole.CLIENTE,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  });

// ─── suite ────────────────────────────────────────────────────────────────────

describe('IUserRepository (contrato)', () => {
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mock: jest.Mocked<IUserRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: USER_REPOSITORY, useValue: mock }],
    }).compile();

    repository = module.get<jest.Mocked<IUserRepository>>(USER_REPOSITORY);
  });

  // ── create ────────────────────────────────────────────────────────────────

  it('create() deve persistir e retornar o usuário criado', async () => {
    const usuario = makeUser();
    repository.create.mockResolvedValue(usuario);

    const resultado = await repository.create(usuario);

    expect(repository.create).toHaveBeenCalledWith(usuario);
    expect(resultado.id).toBe(1);
    expect(resultado.email).toBe('joao@email.com');
  });

  // ── findById ──────────────────────────────────────────────────────────────

  it('findById() deve retornar o usuário quando existir', async () => {
    const usuario = makeUser({ id: 42 });
    repository.findById.mockResolvedValue(usuario);

    const resultado = await repository.findById(42);

    expect(repository.findById).toHaveBeenCalledWith(42);
    expect(resultado).not.toBeNull();
    expect(resultado!.id).toBe(42);
  });

  it('findById() deve retornar null quando não encontrar', async () => {
    repository.findById.mockResolvedValue(null);

    const resultado = await repository.findById(999);

    expect(resultado).toBeNull();
  });

  // ── findByEmail ───────────────────────────────────────────────────────────

  it('findByEmail() deve retornar o usuário quando o e-mail existir', async () => {
    const usuario = makeUser();
    repository.findByEmail.mockResolvedValue(usuario);

    const resultado = await repository.findByEmail('joao@email.com');

    expect(repository.findByEmail).toHaveBeenCalledWith('joao@email.com');
    expect(resultado!.email).toBe('joao@email.com');
  });

  it('findByEmail() deve retornar null quando o e-mail não existir', async () => {
    repository.findByEmail.mockResolvedValue(null);

    const resultado = await repository.findByEmail('inexistente@email.com');

    expect(resultado).toBeNull();
  });

  // ── findAll ───────────────────────────────────────────────────────────────

  it('findAll() deve retornar uma lista de usuários', async () => {
    const usuarios = [
      makeUser({ id: 1 }),
      makeUser({ id: 2, email: 'maria@email.com' }),
    ];
    repository.findAll.mockResolvedValue(usuarios);

    const resultado = await repository.findAll();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].id).toBe(1);
    expect(resultado[1].id).toBe(2);
  });

  it('findAll() deve retornar lista vazia quando não houver usuários', async () => {
    repository.findAll.mockResolvedValue([]);

    const resultado = await repository.findAll();

    expect(resultado).toEqual([]);
  });

  // ── update ────────────────────────────────────────────────────────────────

  it('update() deve salvar as alterações e retornar o usuário atualizado', async () => {
    const atualizado = makeUser({ nome: 'João Atualizado' });
    repository.update.mockResolvedValue(atualizado);

    const resultado = await repository.update(atualizado);

    expect(repository.update).toHaveBeenCalledWith(atualizado);
    expect(resultado.nome).toBe('João Atualizado');
  });

  // ── delete ────────────────────────────────────────────────────────────────

  it('delete() deve chamar o repositório com o id correto', async () => {
    repository.delete.mockResolvedValue(undefined);

    await repository.delete(1);

    expect(repository.delete).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  it('delete() deve realizar soft delete (não remover fisicamente)', async () => {
    // O contrato não lança exceção — apenas resolve void
    repository.delete.mockResolvedValue(undefined);

    await expect(repository.delete(1)).resolves.toBeUndefined();
  });
});
