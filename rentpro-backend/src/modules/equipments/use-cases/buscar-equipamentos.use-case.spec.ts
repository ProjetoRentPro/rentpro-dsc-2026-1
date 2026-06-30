import { Test, TestingModule } from '@nestjs/testing';
import { BuscarEquipamentosUseCase } from './buscar-equipamentos.use-case';
import {
  EQUIPMENT_REPOSITORY,
  IEquipmentRepository,
} from '../repositories/equipment.repository.interface';
import { EquipmentEntity } from '../entities/equipment.entity';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

// â”€â”€â”€ factory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const makeEquipamento = (
  overrides: Partial<EquipmentEntity> = {},
): EquipmentEntity =>
  new EquipmentEntity({
    id: 'uuid-1',
    nome: 'Betoneira 400L',
    categoria: 'ConstruÃ§Ã£o',
    localizacao: 'Curitiba - PR',
    status: StatusEquipamento.DISPONIVEL,
    precoDiaria: 150,
    proprietarioId: 1,
    ...overrides,
  });

// â”€â”€â”€ suite â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe('BuscarEquipamentosUseCase', () => {
  let useCase: BuscarEquipamentosUseCase;
  let repository: jest.Mocked<IEquipmentRepository>;

  beforeEach(async () => {
    const mockRepository: jest.Mocked<IEquipmentRepository> = {
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
      providers: [
        BuscarEquipamentosUseCase,
        { provide: EQUIPMENT_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get(BuscarEquipamentosUseCase);
    repository = module.get(EQUIPMENT_REPOSITORY);
  });

  // â”€â”€ disponibilidade â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  it('deve retornar apenas equipamentos disponÃ­veis', async () => {
    repository.findByFiltros.mockResolvedValue([
      makeEquipamento({ status: StatusEquipamento.DISPONIVEL }),
    ]);

    const resultado = await useCase.execute({});

    expect(
      resultado.every((e) => e.status === StatusEquipamento.DISPONIVEL),
    ).toBe(true);
  });

  it('deve filtrar equipamentos indisponÃ­veis mesmo que o repositÃ³rio os retorne', async () => {
    repository.findByFiltros.mockResolvedValue([
      makeEquipamento({ id: '1', status: StatusEquipamento.DISPONIVEL }),
      makeEquipamento({ id: '2', status: StatusEquipamento.INDISPONIVEL }),
    ]);

    const resultado = await useCase.execute({});

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('1');
  });

  // â”€â”€ filtros â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  it('deve aplicar filtro de categoria ao repositÃ³rio', async () => {
    repository.findByFiltros.mockResolvedValue([
      makeEquipamento({ categoria: 'CÃ¢mera' }),
    ]);

    await useCase.execute({ categoria: 'CÃ¢mera' });

    expect(repository.findByFiltros).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 'CÃ¢mera' }),
    );
  });

  it('deve aplicar filtro de localizaÃ§Ã£o ao repositÃ³rio', async () => {
    repository.findByFiltros.mockResolvedValue([makeEquipamento()]);

    await useCase.execute({ localizacao: 'Curitiba' });

    expect(repository.findByFiltros).toHaveBeenCalledWith(
      expect.objectContaining({ localizacao: 'Curitiba' }),
    );
  });

  it('deve aplicar filtros combinados (categoria + localizaÃ§Ã£o)', async () => {
    repository.findByFiltros.mockResolvedValue([makeEquipamento()]);

    await useCase.execute({ categoria: 'CÃ¢mera', localizacao: 'Curitiba' });

    expect(repository.findByFiltros).toHaveBeenCalledWith(
      expect.objectContaining({
        categoria: 'CÃ¢mera',
        localizacao: 'Curitiba',
      }),
    );
  });

  // â”€â”€ lista vazia â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  it('deve retornar lista vazia quando nÃ£o houver resultados', async () => {
    repository.findByFiltros.mockResolvedValue([]);

    const resultado = await useCase.execute({ categoria: 'Inexistente' });

    expect(resultado).toEqual([]);
  });

  // â”€â”€ resposta sem campos sensÃ­veis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  it('nÃ£o deve expor proprietarioId na resposta', async () => {
    repository.findByFiltros.mockResolvedValue([makeEquipamento()]);

    const resultado = await useCase.execute({});

    expect(resultado[0]).not.toHaveProperty('proprietarioId');
  });
});
