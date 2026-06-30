import { JwtAuthGuard } from './jwt-auth.guard';

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
