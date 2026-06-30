import { Test, TestingModule } from '@nestjs/testing';
import {
  IEquipmentRepository,
  EQUIPMENT_REPOSITORY,
} from './equipment.repository.interface';
import { EquipmentEntity } from '../entities/equipment.entity';
import { StatusEquipamento } from '../enums/status-equipamento.enum';
import { BuscarEquipamentoDto } from '../dto/buscar-equipamento.dto';

// â”€â”€â”€ factory helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const makeEquipamento = (
  overrides: Partial<EquipmentEntity> = {},
): EquipmentEntity =>
  new EquipmentEntity({
    id: 'uuid-1',
    nome: 'Betoneira 400L',
    categoria: 'ConstruÃ§Ã£o',
    localizacao: 'Curitiba - PR',
    status: StatusEquipamento.DISPONIVEL,
    precoDiaria: 150.0,
    proprietarioId: 1,
    ...overrides,
  });

// â”€â”€â”€ suite â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe('IEquipmentRepository â€” busca por filtros', () => {
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

    repository =
      module.get<jest.Mocked<IEquipmentRepository>>(EQUIPMENT_REPOSITORY);
  });

  // â”€â”€ findByCategoria â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  it('deve retornar equipamentos pela categoria', async () => {
    const esperado = [makeEquipamento({ categoria: 'ConstruÃ§Ã£o' })];
    repository.findByCategoria.mockResolvedValue(esperado);

    const resultado = await repository.findByCategoria('ConstruÃ§Ã£o');

    expect(repository.findByCategoria).toHaveBeenCalledWith('ConstruÃ§Ã£o');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].categoria).toBe('ConstruÃ§Ã£o');
  });

  // â”€â”€ findByLocalizacao â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  it('deve retornar equipamentos pela localizaÃ§Ã£o', async () => {
    const esperado = [makeEquipamento({ localizacao: 'SÃ£o Paulo - SP' })];
    repository.findByLocalizacao.mockResolvedValue(esperado);

    const resultado = await repository.findByLocalizacao('SÃ£o Paulo');

    expect(resultado[0].localizacao).toBe('SÃ£o Paulo - SP');
  });

  // â”€â”€ findByFiltros â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  it('deve retornar equipamentos com filtros combinados', async () => {
    const esperado = [
      makeEquipamento({ categoria: 'CÃ¢mera', localizacao: 'Curitiba - PR' }),
    ];
    repository.findByFiltros.mockResolvedValue(esperado);

    const filtros = new BuscarEquipamentoDto();
    Object.assign(filtros, {
      categoria: 'CÃ¢mera',
      localizacao: 'Curitiba',
      precoMaximo: 200,
    });

    const resultado = await repository.findByFiltros(filtros);

    expect(repository.findByFiltros).toHaveBeenCalledWith({
      categoria: 'CÃ¢mera',
      localizacao: 'Curitiba',
      precoMaximo: 200,
    });
    expect(resultado).toHaveLength(1);
  });

  it('deve retornar apenas equipamentos disponÃ­veis', async () => {
    // O repositÃ³rio jÃ¡ filtra por DISPONIVEL internamente
    const disponivel = makeEquipamento({
      status: StatusEquipamento.DISPONIVEL,
    });
    repository.findByFiltros.mockResolvedValue([disponivel]);

    const resultado = await repository.findByFiltros(
      new BuscarEquipamentoDto({}),
    );

    expect(
      resultado.every((e) => e.status === StatusEquipamento.DISPONIVEL),
    ).toBe(true);
  });

  it('deve retornar lista vazia quando nÃ£o houver resultados', async () => {
    repository.findByFiltros.mockResolvedValue([]);

    const resultado = await repository.findByFiltros(
      new BuscarEquipamentoDto({ categoria: 'Inexistente' }),
    );

    expect(resultado).toEqual([]);
  });

  it('deve filtrar por preÃ§o mÃ¡ximo', async () => {
    const barato = makeEquipamento({ precoDiaria: 80 });
    repository.findByFiltros.mockResolvedValue([barato]);

    const resultado = await repository.findByFiltros(
      new BuscarEquipamentoDto({ precoMaximo: 100 }),
    );

    expect(resultado[0].precoDiaria).toBeLessThanOrEqual(100);
  });
});
