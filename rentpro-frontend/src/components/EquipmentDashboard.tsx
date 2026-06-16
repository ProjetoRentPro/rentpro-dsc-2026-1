import { useState, useEffect, useCallback } from 'react';
import { equipmentService } from '../services/equipment.service';
import type { Equipment } from '../services/equipment.service';
import { EquipmentModal } from './EquipmentModal';
import './EquipmentDashboard.css';

interface Props {
  token: string;
  userId: number;
}

export function EquipmentDashboard({ token, userId }: Props) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Equipment | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await equipmentService.findAll(token);
      setEquipments(all.filter(e => e.proprietarioId === userId));
    } catch {
      setEquipments([]);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Remover este equipamento?')) return;
    await equipmentService.remove(id, token);
    load();
  }

  function handleEdit(equipment: Equipment) {
    setEditing(equipment);
    setShowModal(true);
  }

  function handleNew() {
    setEditing(undefined);
    setShowModal(true);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Meus equipamentos</h2>
          <p className="dashboard-sub">Gerencie os equipamentos que você disponibiliza para locação</p>
        </div>
        <button className="btn-primary btn-new" onClick={handleNew}>
          + Cadastrar equipamento
        </button>
      </div>

      {loading ? (
        <div className="dashboard-empty">Carregando...</div>
      ) : equipments.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-icon">📦</div>
          <p>Você ainda não cadastrou nenhum equipamento.</p>
          <button className="btn-primary" onClick={handleNew}>Cadastrar primeiro equipamento</button>
        </div>
      ) : (
        <div className="eq-grid">
          {equipments.map(eq => (
            <div key={eq.id} className="eq-card">
              <div className="eq-card-header">
                <span className={`eq-status eq-status--${eq.status}`}>
                  {eq.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                </span>
                <span className="eq-categoria">{eq.categoria}</span>
              </div>
              <h3 className="eq-nome">{eq.nome}</h3>
              {eq.descricao && <p className="eq-descricao">{eq.descricao}</p>}
              <div className="eq-info">
                <span>📍 {eq.localizacao}</span>
                <span className="eq-preco">R$ {Number(eq.precoDiaria).toFixed(2)}<small>/dia</small></span>
              </div>
              <div className="eq-card-actions">
                <button className="btn-edit" onClick={() => handleEdit(eq)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(eq.id)}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <EquipmentModal
          token={token}
          proprietarioId={userId}
          equipment={editing}
          onClose={() => setShowModal(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
