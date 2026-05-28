import { Test, TestingModule } from '@nestjs/testing';
import { IEquipmentRepository, EQUIPMENT_REPOSITORY } from './equipment.repository.interface';
import { EquipmentEntity } from '../entities/equipment.entity';
import { StatusEquipamento } from '../enums/status-equipamento.enum';
import { BuscarEquipamentoDto } from '../dto/buscar-equipamento.dto';

// ─── factory helpers ──────────────────────────────────────────────────────────

const makeEquipamento = (overrides: Partial<EquipmentEntity> = {}): EquipmentEntity =>
  new EquipmentEntity({
    id: 'uuid-1',
    nome: 'Betoneira 400L',
    categoria: 'Construção',
    localizacao: 'Curitiba - PR',
    status: StatusEquipamento.DISPONIVEL,
    precoDiaria: 150.0,
    proprietarioId: 'owner-uuid',
    ...overrides,
  });

// ─── suite ────────────────────────────────────────────────────────────────────

describe('IEquipmentRepository — busca por filtros', () => {
  let repository: jest.Mocked<IEquipmentRepository>;

  beforeEach(async () => {
    const mock: jest.Mocked<IEquipmentRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCategoria: jest.fn(),
      findByLocalizacao: jest.fn(),
      findByFiltros: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: EQUIPMENT_REPOSITORY, useValue: mock }],
    }).compile();

    repository = module.get<jest.Mocked<IEquipmentRepository>>(EQUIPMENT_REPOSITORY);
  });

  // ── findByCategoria ───────────────────────────────────────────────────────

  it('deve retornar equipamentos pela categoria', async () => {
    const esperado = [makeEquipamento({ categoria: 'Construção' })];
    repository.findByCategoria.mockResolvedValue(esperado);

    const resultado = await repository.findByCategoria('Construção');

    expect(repository.findByCategoria).toHaveBeenCalledWith('Construção');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].categoria).toBe('Construção');
  });

  // ── findByLocalizacao ─────────────────────────────────────────────────────

  it('deve retornar equipamentos pela localização', async () => {
    const esperado = [makeEquipamento({ localizacao: 'São Paulo - SP' })];
    repository.findByLocalizacao.mockResolvedValue(esperado);

    const resultado = await repository.findByLocalizacao('São Paulo');

    expect(resultado[0].localizacao).toBe('São Paulo - SP');
  });

  // ── findByFiltros ─────────────────────────────────────────────────────────

  it('deve retornar equipamentos com filtros combinados', async () => {
    const esperado = [makeEquipamento({ categoria: 'Câmera', localizacao: 'Curitiba - PR' })];
    repository.findByFiltros.mockResolvedValue(esperado);

    const filtros = new BuscarEquipamentoDto();
    Object.assign(filtros, {
      categoria: 'Câmera',
      localizacao: 'Curitiba',
      precoMaximo: 200,
    });

    const resultado = await repository.findByFiltros(filtros);

    expect(repository.findByFiltros).toHaveBeenCalledWith({
      categoria: 'Câmera',
      localizacao: 'Curitiba',
      precoMaximo: 200,
    });
    expect(resultado).toHaveLength(1);
  });

  it('deve retornar apenas equipamentos disponíveis', async () => {
    // O repositório já filtra por DISPONIVEL internamente
    const disponivel = makeEquipamento({ status: StatusEquipamento.DISPONIVEL });
    repository.findByFiltros.mockResolvedValue([disponivel]);

    const resultado = await repository.findByFiltros(new BuscarEquipamentoDto({}));

    expect(resultado.every(e => e.status === StatusEquipamento.DISPONIVEL)).toBe(true);
  });

  it('deve retornar lista vazia quando não houver resultados', async () => {
    repository.findByFiltros.mockResolvedValue([]);

    const resultado = await repository.findByFiltros(new BuscarEquipamentoDto({ categoria: 'Inexistente' }));

    expect(resultado).toEqual([]);
  });

  it('deve filtrar por preço máximo', async () => {
    const barato = makeEquipamento({ precoDiaria: 80 });
    repository.findByFiltros.mockResolvedValue([barato]);

    const resultado = await repository.findByFiltros(new BuscarEquipamentoDto({ precoMaximo: 100 }));

    expect(resultado[0].precoDiaria).toBeLessThanOrEqual(100);
  });
});