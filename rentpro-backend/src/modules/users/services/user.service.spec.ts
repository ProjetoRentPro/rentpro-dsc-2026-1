import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
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

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<IUserRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: USER_REPOSITORY, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(USER_REPOSITORY);
  });

  // ── create ────────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('deve criar e retornar o usuário quando o email não existir', async () => {
      const usuario = makeUser();
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue(usuario);

      const resultado = await service.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha123',
        tipo: UserRole.CLIENTE,
      });

      expect(repository.findByEmail).toHaveBeenCalledWith('joao@email.com');
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(resultado.email).toBe('joao@email.com');
    });

    it('deve armazenar senhaHash diferente da senha original (bcrypt)', async () => {
      repository.findByEmail.mockResolvedValue(null);

      let senhaHashCapturada: string | undefined;
      repository.create.mockImplementation((entity) => {
        senhaHashCapturada = entity.senhaHash;
        return Promise.resolve(makeUser({ senhaHash: entity.senhaHash }));
      });

      await service.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha123',
        tipo: UserRole.CLIENTE,
      });

      expect(senhaHashCapturada).not.toBe('senha123');
      expect(senhaHashCapturada).toMatch(/^\$2b\$/); // formato bcrypt
    });

    it('deve lançar ConflictException quando o email já estiver cadastrado', async () => {
      repository.findByEmail.mockResolvedValue(makeUser());

      await expect(
        service.create({
          nome: 'João Silva',
          email: 'joao@email.com',
          senha: 'senha123',
          tipo: UserRole.CLIENTE,
        }),
      ).rejects.toThrow(ConflictException);

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  // ── findById ──────────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('deve retornar o usuário quando encontrado', async () => {
      const usuario = makeUser({ id: 42 });
      repository.findById.mockResolvedValue(usuario);

      const resultado = await service.findById(42);

      expect(resultado.id).toBe(42);
      expect(repository.findById).toHaveBeenCalledWith(42);
    });

    it('deve lançar NotFoundException quando o usuário não existir', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('deve retornar a lista de usuários', async () => {
      const usuarios = [
        makeUser({ id: 1 }),
        makeUser({ id: 2, email: 'maria@email.com' }),
      ];
      repository.findAll.mockResolvedValue(usuarios);

      const resultado = await service.findAll();

      expect(resultado).toHaveLength(2);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não houver usuários', async () => {
      repository.findAll.mockResolvedValue([]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([]);
    });
  });

  // ── update ────────────────────────────────────────────────────────────────

  describe('update()', () => {
    it('deve atualizar e retornar o usuário modificado', async () => {
      const existente = makeUser();
      const atualizado = makeUser({ nome: 'João Atualizado' });
      repository.findById.mockResolvedValue(existente);
      repository.update.mockResolvedValue(atualizado);

      const resultado = await service.update(1, { nome: 'João Atualizado' });

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(resultado.nome).toBe('João Atualizado');
    });

    it('deve lançar NotFoundException se o usuário não existir', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(999, { nome: 'Novo' })).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  // ── delete ────────────────────────────────────────────────────────────────

  describe('delete()', () => {
    it('deve chamar repository.delete() com o id correto', async () => {
      repository.findById.mockResolvedValue(makeUser());
      repository.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se o usuário não existir', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);

      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
