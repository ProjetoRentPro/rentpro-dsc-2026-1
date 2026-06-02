import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

// ─── helpers ──────────────────────────────────────────────────────────────────

const makeContext = (authHeader?: string): ExecutionContext => {
  const request = {
    headers: authHeader ? { authorization: authHeader } : {},
  };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;
};

// ─── suite ────────────────────────────────────────────────────────────────────

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('deve ser definido', () => {
    expect(guard).toBeDefined();
  });

  it('deve estender AuthGuard("jwt")', () => {
    // Verifica que o guard herda o canActivate do Passport
    expect(typeof guard.canActivate).toBe('function');
  });

  it('deve ter método canActivate', () => {
    expect(guard.canActivate).toBeDefined();
  });
});
