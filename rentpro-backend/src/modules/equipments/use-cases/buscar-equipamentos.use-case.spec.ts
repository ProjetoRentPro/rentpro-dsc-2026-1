import { Test, TestingModule } from '@nestjs/testing';
import { BuscarEquipamentosUseCase } from './buscar-equipamentos.use-case';
import {
  EQUIPMENT_REPOSITORY,
  IEquipmentRepository,
} from '../repositories/equipment.repository.interface';
import { EquipmentEntity } from '../entities/equipment.entity';
import { StatusEquipamento } from '../enums/status-equipamento.enum';

// ─── factory ─────────────────────────────────────────────────────────────────

const makeEquipamento = (overrides: Partial<EquipmentEntity> = {}): EquipmentEntity =>
  new EquipmentEntity({
    id: 'uuid-1',
    nome: 'Betoneira 400L',
    categoria: 'Construção',
    localizacao: 'Curitiba - PR',
    status: StatusEquipamento.DISPONIVEL,
    precoDiaria: 150,
    proprietarioId: 'owner-uuid',
    ...overrides,
  });

// ─── suite ────────────────────────────────────────────────────────────────────

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

  // ── disponibilidade ───────────────────────────────────────────────────────

  it('deve retornar apenas equipamentos disponíveis', async () => {
    repository.findByFiltros.mockResolvedValue([
      makeEquipamento({ status: StatusEquipamento.DISPONIVEL }),
    ]);

    const resultado = await useCase.execute({});

    expect(resultado.every(e => e.status === StatusEquipamento.DISPONIVEL)).toBe(true);
  });

  it('deve filtrar equipamentos indisponíveis mesmo que o repositório os retorne', async () => {
    repository.findByFiltros.mockResolvedValue([
      makeEquipamento({ id: '1', status: StatusEquipamento.DISPONIVEL }),
      makeEquipamento({ id: '2', status: StatusEquipamento.INDISPONIVEL }),
    ]);

    const resultado = await useCase.execute({});

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('1');
  });

  // ── filtros ───────────────────────────────────────────────────────────────

  it('deve aplicar filtro de categoria ao repositório', async () => {
    repository.findByFiltros.mockResolvedValue([makeEquipamento({ categoria: 'Câmera' })]);

    await useCase.execute({ categoria: 'Câmera' });

    expect(repository.findByFiltros).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 'Câmera' }),
    );
  });

  it('deve aplicar filtro de localização ao repositório', async () => {
    repository.findByFiltros.mockResolvedValue([makeEquipamento()]);

    await useCase.execute({ localizacao: 'Curitiba' });

    expect(repository.findByFiltros).toHaveBeenCalledWith(
      expect.objectContaining({ localizacao: 'Curitiba' }),
    );
  });

  it('deve aplicar filtros combinados (categoria + localização)', async () => {
    repository.findByFiltros.mockResolvedValue([makeEquipamento()]);

    await useCase.execute({ categoria: 'Câmera', localizacao: 'Curitiba' });

    expect(repository.findByFiltros).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 'Câmera', localizacao: 'Curitiba' }),
    );
  });

  // ── lista vazia ───────────────────────────────────────────────────────────

  it('deve retornar lista vazia quando não houver resultados', async () => {
    repository.findByFiltros.mockResolvedValue([]);

    const resultado = await useCase.execute({ categoria: 'Inexistente' });

    expect(resultado).toEqual([]);
  });

  // ── resposta sem campos sensíveis ─────────────────────────────────────────

  it('não deve expor proprietarioId na resposta', async () => {
    repository.findByFiltros.mockResolvedValue([makeEquipamento()]);

    const resultado = await useCase.execute({});

    expect(resultado[0]).not.toHaveProperty('proprietarioId');
  });
});