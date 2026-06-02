import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../../commons/enums/user-role.enum';

// ─── helpers ──────────────────────────────────────────────────────────────────

const makeContext = (userTipo?: UserRole): ExecutionContext => {
  const request = {
    user: userTipo ? { sub: 1, email: 'joao@email.com', tipo: userTipo } : undefined,
  };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;
};

// ─── suite ────────────────────────────────────────────────────────────────────

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new RolesGuard(reflector);
  });

  it('deve ser definido', () => {
    expect(guard).toBeDefined();
  });

  it('deve permitir acesso quando nenhuma role for exigida (sem @Roles)', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const ctx = makeContext(UserRole.CLIENTE);

    const resultado = guard.canActivate(ctx);

    expect(resultado).toBe(true);
  });

  it('deve permitir acesso quando o usuário tiver a role exigida', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
    const ctx = makeContext(UserRole.ADMIN);

    const resultado = guard.canActivate(ctx);

    expect(resultado).toBe(true);
  });

  it('deve lançar ForbiddenException quando o usuário não tiver a role exigida', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
    const ctx = makeContext(UserRole.CLIENTE);

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('deve lançar ForbiddenException quando não houver usuário autenticado', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
    const ctx = makeContext(undefined);

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('deve consultar o reflector com a chave ROLES_KEY', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const ctx = makeContext(UserRole.CLIENTE);

    guard.canActivate(ctx);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
  });

  it('deve permitir acesso quando o usuário tiver uma das roles aceitas', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN, UserRole.CLIENTE]);
    const ctx = makeContext(UserRole.CLIENTE);

    const resultado = guard.canActivate(ctx);

    expect(resultado).toBe(true);
  });
});
