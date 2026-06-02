import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { IUserRepository, USER_REPOSITORY } from '../../users/repositories/user.repository.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole } from '../../../commons/enums/user-role.enum';

// ─── factory helper ───────────────────────────────────────────────────────────

const makeUser = (overrides: Partial<UserEntity> = {}): UserEntity =>
  new UserEntity({
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    senhaHash: '$2b$12$hashedpassword',
    tipo: UserRole.CLIENTE,
    ...overrides,
  });

// ─── suite ────────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;
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
      imports: [
        JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1d' } }),
      ],
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get(AuthService);
    repository = module.get(USER_REPOSITORY);
  });

  // ── hashPassword ──────────────────────────────────────────────────────────

  describe('hashPassword()', () => {
    it('deve retornar uma string diferente da senha original', async () => {
      const hash = await service.hashPassword('minha_senha');

      expect(hash).not.toBe('minha_senha');
      expect(typeof hash).toBe('string');
    });

    it('deve gerar hashes diferentes para a mesma senha (salt aleatório)', async () => {
      const hash1 = await service.hashPassword('minha_senha');
      const hash2 = await service.hashPassword('minha_senha');

      expect(hash1).not.toBe(hash2);
    });

    it('deve gerar um hash verificável com bcrypt.compare', async () => {
      const hash = await service.hashPassword('minha_senha');
      const valido = await bcrypt.compare('minha_senha', hash);

      expect(valido).toBe(true);
    });

    it('deve usar custo mínimo de 10 rounds (RN05)', async () => {
      const hash = await service.hashPassword('minha_senha');
      const rounds = bcrypt.getRounds(hash);

      expect(rounds).toBeGreaterThanOrEqual(10);
    });
  });

  // ── validateUser ──────────────────────────────────────────────────────────

  describe('validateUser()', () => {
    it('deve retornar o usuário quando email e senha forem válidos', async () => {
      const senhaPlana = 'senha_correta';
      const hash = await bcrypt.hash(senhaPlana, 12);
      const usuario = makeUser({ senhaHash: hash });
      repository.findByEmail.mockResolvedValue(usuario);

      const resultado = await service.validateUser('joao@email.com', senhaPlana);

      expect(resultado).not.toBeNull();
      expect(resultado!.email).toBe('joao@email.com');
    });

    it('deve retornar null quando o email não existir', async () => {
      repository.findByEmail.mockResolvedValue(null);

      const resultado = await service.validateUser('inexistente@email.com', 'qualquer');

      expect(resultado).toBeNull();
      expect(repository.findByEmail).toHaveBeenCalledWith('inexistente@email.com');
    });

    it('deve retornar null quando a senha estiver incorreta', async () => {
      const hash = await bcrypt.hash('senha_correta', 12);
      const usuario = makeUser({ senhaHash: hash });
      repository.findByEmail.mockResolvedValue(usuario);

      const resultado = await service.validateUser('joao@email.com', 'senha_errada');

      expect(resultado).toBeNull();
    });

    it('não deve expor o senhaHash no retorno', async () => {
      const senhaPlana = 'senha_correta';
      const hash = await bcrypt.hash(senhaPlana, 12);
      const usuario = makeUser({ senhaHash: hash });
      repository.findByEmail.mockResolvedValue(usuario);

      const resultado = await service.validateUser('joao@email.com', senhaPlana);

      expect(resultado).not.toBeNull();
      expect((resultado as any).senhaHash).toBeUndefined();
    });
  });
});
