import { EquipmentEntity } from '../entities/equipment.entity';
import { BuscarEquipamentoDto } from '../dto/buscar-equipamento.dto';


export const EQUIPMENT_REPOSITORY = 'EQUIPMENT_REPOSITORY';

export interface IEquipmentRepository {
  // ── CRUD base ────────────────────────────────────────────────────────────
  create(entity: EquipmentEntity): Promise<EquipmentEntity>;
  findById(id: string): Promise<EquipmentEntity | null>;
  findAll(): Promise<EquipmentEntity[]>;
  update(entity: EquipmentEntity): Promise<EquipmentEntity>;
  delete(id: string): Promise<void>;

  // ── Métodos de busca (UC04) ───────────────────────────────────────────────
  findByCategoria(categoria: string): Promise<EquipmentEntity[]>;
  findByLocalizacao(localizacao: string): Promise<EquipmentEntity[]>;
  findByFiltros(filtros: BuscarEquipamentoDto): Promise<EquipmentEntity[]>;
}