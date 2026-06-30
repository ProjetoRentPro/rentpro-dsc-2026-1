import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { UserRole } from '../../commons/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<UserService> = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: serviceMock }],
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  // ── POST /users ───────────────────────────────────────────────────────────

  describe('create()', () => {
    it('deve retornar o usuário criado', async () => {
      const dto: CreateUserDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha123',
        tipo: UserRole.CLIENTE,
      };
      service.create.mockResolvedValue(makeUser());

      const resultado = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(resultado.email).toBe('joao@email.com');
    });

    it('deve propagar ConflictException quando o email já existir', async () => {
      service.create.mockRejectedValue(new ConflictException());

      await expect(
        controller.create({
          nome: 'João',
          email: 'joao@email.com',
          senha: 'senha123',
          tipo: UserRole.CLIENTE,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ── GET /users ────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('deve retornar a lista de usuários', async () => {
      const usuarios = [
        makeUser({ id: 1 }),
        makeUser({ id: 2, email: 'maria@email.com' }),
      ];
      service.findAll.mockResolvedValue(usuarios);

      const resultado = await controller.findAll();

      expect(resultado).toHaveLength(2);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não houver usuários', async () => {
      service.findAll.mockResolvedValue([]);

      const resultado = await controller.findAll();

      expect(resultado).toEqual([]);
    });
  });

  // ── GET /users/:id ────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('deve retornar o usuário encontrado', async () => {
      service.findById.mockResolvedValue(makeUser({ id: 1 }));

      const resultado = await controller.findById(1);

      expect(resultado.id).toBe(1);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('deve propagar NotFoundException quando o usuário não existir', async () => {
      service.findById.mockRejectedValue(new NotFoundException());

      await expect(controller.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ── PATCH /users/:id ──────────────────────────────────────────────────────

  describe('update()', () => {
    it('deve retornar o usuário atualizado', async () => {
      const dto: UpdateUserDto = { nome: 'João Atualizado' };
      service.update.mockResolvedValue(makeUser({ nome: 'João Atualizado' }));

      const resultado = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(resultado.nome).toBe('João Atualizado');
    });

    it('deve propagar NotFoundException se o usuário não existir', async () => {
      service.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(999, { nome: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── DELETE /users/:id ─────────────────────────────────────────────────────

  describe('delete()', () => {
    it('deve chamar service.delete() com o id correto', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete(1);

      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('deve propagar NotFoundException se o usuário não existir', async () => {
      service.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
    });
  });
});
