import { UserEntity } from './user.entity';
import { UserRole } from '../../../commons/enums/user-role.enum';

describe('UserEntity', () => {
  it('deve criar uma instância com todos os campos obrigatórios via construtor partial', () => {
    const entity = new UserEntity({
      nome: 'João Silva',
      email: 'joao@email.com',
      senhaHash: 'hash123',
      tipo: UserRole.CLIENTE,
    });

    expect(entity.nome).toBe('João Silva');
    expect(entity.email).toBe('joao@email.com');
    expect(entity.senhaHash).toBe('hash123');
    expect(entity.tipo).toBe(UserRole.CLIENTE);
  });

  it('deve ter as propriedades obrigatórias definidas na classe', () => {
    const entity = new UserEntity();
    expect(entity).toHaveProperty('nome');
    expect(entity).toHaveProperty('email');
    expect(entity).toHaveProperty('senhaHash');
    expect(entity).toHaveProperty('tipo');
  });

  it('deve aceitar UserRole.ADMIN como tipo', () => {
    const entity = new UserEntity({ tipo: UserRole.ADMIN });
    expect(entity.tipo).toBe(UserRole.ADMIN);
  });

  it('deve aceitar UserRole.CLIENTE como tipo', () => {
    const entity = new UserEntity({ tipo: UserRole.CLIENTE });
    expect(entity.tipo).toBe(UserRole.CLIENTE);
  });

  it('UserRole deve conter apenas os valores admin e cliente', () => {
    expect(Object.values(UserRole)).toEqual(['admin', 'cliente']);
  });

  it('deve ter campo deletedAt como opcional (soft delete)', () => {
    const entity = new UserEntity({ nome: 'Maria' });
    expect(entity).toHaveProperty('deletedAt');
    expect(entity.deletedAt).toBeUndefined();
  });

  it('não deve expor senha em texto puro — apenas senhaHash', () => {
    const entity = new UserEntity();
    expect(entity).not.toHaveProperty('senha');
    expect(entity).not.toHaveProperty('password');
  });
});
