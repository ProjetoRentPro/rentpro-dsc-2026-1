import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../commons/enums/user-role.enum';
import { UserEntity } from '../users/entities/user.entity';

// ─── factory helper ───────────────────────────────────────────────────────────

const makeUserSemSenha = (overrides = {}): Omit<UserEntity, 'senhaHash'> =>
  ({
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    tipo: UserRole.CLIENTE,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }) as Omit<UserEntity, 'senhaHash'>;

// ─── suite ────────────────────────────────────────────────────────────────────

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const serviceMock = {
      validateUser: jest.fn(),
      login: jest.fn(),
      hashPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: serviceMock }],
    }).compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  // ── POST /auth/login ──────────────────────────────────────────────────────

  describe('login()', () => {
    it('deve retornar access_token quando as credenciais forem válidas', async () => {
      const dto: LoginDto = { email: 'joao@email.com', senha: 'senha123' };
      service.validateUser.mockResolvedValue(makeUserSemSenha());
      service.login.mockResolvedValue({ access_token: 'jwt.token.aqui' });

      const resultado = await controller.login(dto);

      expect(service.validateUser).toHaveBeenCalledWith(
        'joao@email.com',
        'senha123',
      );
      expect(service.login).toHaveBeenCalledTimes(1);
      expect(resultado).toHaveProperty('access_token');
      expect(resultado.access_token).toBe('jwt.token.aqui');
    });

    it('deve lançar UnauthorizedException quando a senha for incorreta', async () => {
      service.validateUser.mockResolvedValue(null);

      await expect(
        controller.login({ email: 'joao@email.com', senha: 'errada' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(service.login).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando o email não existir', async () => {
      service.validateUser.mockResolvedValue(null);

      await expect(
        controller.login({ email: 'inexistente@email.com', senha: 'qualquer' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve chamar validateUser com o email e senha do body', async () => {
      service.validateUser.mockResolvedValue(makeUserSemSenha());
      service.login.mockResolvedValue({ access_token: 'token' });

      await controller.login({ email: 'joao@email.com', senha: 'senha123' });

      expect(service.validateUser).toHaveBeenCalledWith(
        'joao@email.com',
        'senha123',
      );
    });
  });
});
