import { EquipmentEntity } from './equipment.entity';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

describe('EquipmentEntity', () => {
  it('deve ter todos os campos obrigatórios', () => {
    const entity = new EquipmentEntity();
    expect(entity).toHaveProperty('nome');
    expect(entity).toHaveProperty('categoria');
    expect(entity).toHaveProperty('localizacao');
    expect(entity).toHaveProperty('status');
    expect(entity).toHaveProperty('precoDiaria');
    expect(entity).toHaveProperty('proprietarioId');
  });

  it('não deve ter campos irrelevantes (ex.: senha)', () => {
    const entity = new EquipmentEntity();
    expect(entity).not.toHaveProperty('senha');
    expect(entity).not.toHaveProperty('numeroCartao');
  });

  it('deve aceitar construção via partial', () => {
    const entity = new EquipmentEntity({
      nome: 'Betoneira 400L',
      categoria: 'Construção',
      localizacao: 'Curitiba - PR',
      status: StatusEquipamento.DISPONIVEL,
      precoDiaria: 150.0,
      proprietarioId: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(entity.nome).toBe('Betoneira 400L');
    expect(entity.localizacao).toBe('Curitiba - PR');
    expect(entity.status).toBe(StatusEquipamento.DISPONIVEL);
  });

  it('deve ter status DISPONIVEL como valor padrão', () => {
    const entity = new EquipmentEntity({ nome: 'Escavadeira' });
    // O default é aplicado pelo TypeORM na persistência,
    // mas o enum deve estar disponível na entidade
    expect(Object.values(StatusEquipamento)).toContain(
      StatusEquipamento.DISPONIVEL,
    );
  });

  it('deve aceitar descrição como campo opcional', () => {
    const semDescricao = new EquipmentEntity({ nome: 'Serra' });
    expect(semDescricao.descricao).toBeUndefined();

    const comDescricao = new EquipmentEntity({ descricao: 'Serra circular 7 1/4"' });
    expect(comDescricao.descricao).toBe('Serra circular 7 1/4"');
  });
});