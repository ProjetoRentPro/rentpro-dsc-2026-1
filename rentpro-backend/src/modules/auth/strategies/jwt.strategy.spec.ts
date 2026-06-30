import { Test } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtStrategy, JwtPayload } from './jwt.strategy';
import { USER_REPOSITORY } from '../../users/repositories/user.repository.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole } from '../../../commons/enums/user-role.enum';

// ─── factory helper ───────────────────────────────────────────────────────────

const makeUserSemSenha = (overrides = {}) => ({
  id: 1,
  nome: 'João Silva',
  email: 'joao@email.com',
  tipo: UserRole.CLIENTE,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

// ─── suite ────────────────────────────────────────────────────────────────────

describe('AuthService — login() e JwtStrategy', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        { provide: USER_REPOSITORY, useValue: repositoryMock },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-secret') },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    jwtService = module.get(JwtService);
    jwtStrategy = module.get(JwtStrategy);
  });

  // ── login ─────────────────────────────────────────────────────────────────

  describe('login()', () => {
    it('deve retornar um objeto com access_token não vazio', async () => {
      const user = makeUserSemSenha() as Omit<UserEntity, 'senhaHash'>;

      const resultado = await authService.login(user);

      expect(resultado).toHaveProperty('access_token');
      expect(typeof resultado.access_token).toBe('string');
      expect(resultado.access_token.length).toBeGreaterThan(0);
    });

    it('deve embutir sub (user_id) e email no payload do token', async () => {
      const user = makeUserSemSenha() as Omit<UserEntity, 'senhaHash'>;

      const { access_token } = await authService.login(user);
      const payload = jwtService.decode<{ sub: number; email: string }>(
        access_token,
      );

      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe(user.email);
    });

    it('deve embutir o tipo (role) no payload do token', async () => {
      const user = makeUserSemSenha({ tipo: UserRole.ADMIN }) as Omit<
        UserEntity,
        'senhaHash'
      >;

      const { access_token } = await authService.login(user);
      const payload = jwtService.decode<{ tipo: UserRole }>(access_token);

      expect(payload.tipo).toBe(UserRole.ADMIN);
    });
  });

  // ── JwtStrategy.validate ──────────────────────────────────────────────────

  describe('JwtStrategy.validate()', () => {
    it('deve retornar o payload quando o token for válido', async () => {
      const payload = {
        sub: 1,
        email: 'joao@email.com',
        tipo: UserRole.CLIENTE,
      };

      const resultado = await jwtStrategy.validate(payload);

      expect(resultado).toEqual(payload);
    });

    it('deve lançar UnauthorizedException quando o payload não tiver sub', async () => {
      const payloadInvalido = { email: 'joao@email.com' };

      await expect(
        jwtStrategy.validate(payloadInvalido as unknown as JwtPayload),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException quando o payload não tiver email', async () => {
      const payloadInvalido = { sub: 1 };

      await expect(
        jwtStrategy.validate(payloadInvalido as unknown as JwtPayload),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
