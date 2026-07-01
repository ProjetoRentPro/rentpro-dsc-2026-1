import { useEffect, useRef } from 'react';
import type { Equipment, CreateEquipmentRequest, UpdateEquipmentRequest } from '../types/equipment';
import { createEquipment, updateEquipment } from '../api/equipmentsApi';
import { getErrorMessage } from '../utils/getErrorMessage';
import './EquipmentModal.css';

interface Props {
  proprietarioId: number;
  equipment?: Equipment;
  onClose: () => void;
  onSaved: () => void;
}

export function EquipmentModal({ proprietarioId, equipment, onClose, onSaved }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const isEdit = !!equipment;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    try {
      if (isEdit) {
        const payload: UpdateEquipmentRequest = {
          nome: get('nome'),
          descricao: get('descricao') || undefined,
          categoria: get('categoria'),
          localizacao: get('localizacao'),
          precoDiaria: parseFloat(get('precoDiaria')),
          status: get('status') as 'disponivel' | 'indisponivel',
        };
        await updateEquipment(equipment.id, payload);
      } else {
        const payload: CreateEquipmentRequest = {
          nome: get('nome'),
          proprietarioId,
          descricao: get('descricao') || undefined,
          categoria: get('categoria'),
          localizacao: get('localizacao'),
          precoDiaria: parseFloat(get('precoDiaria')),
        };
        await createEquipment(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      alert('Erro ao salvar equipamento: ' + getErrorMessage(err));
    }
  }

  return (
    <div className="modal-backdrop" ref={backdropRef} onClick={e => e.target === backdropRef.current && onClose()}>
      <div className="modal eq-modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="eq-modal-title">{isEdit ? 'Editar equipamento' : 'Cadastrar equipamento'}</h2>

        <form onSubmit={handleSubmit} className="eq-form">
          <div className="eq-row">
            <div className="field">
              <label>Nome do equipamento *</label>
              <input name="nome" required defaultValue={equipment?.nome} placeholder="Ex: Furadeira de impacto" />
            </div>
            <div className="field">
              <label>Categoria *</label>
              <input name="categoria" required defaultValue={equipment?.categoria} placeholder="Ex: Ferramentas" />
            </div>
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea name="descricao" rows={2} defaultValue={equipment?.descricao} placeholder="Descreva o equipamento..." />
          </div>

          <div className="eq-row">
            <div className="field">
              <label>Localização *</label>
              <input name="localizacao" required defaultValue={equipment?.localizacao} placeholder="Ex: Curitiba, PR" />
            </div>
            <div className="field">
              <label>Preço por diária (R$) *</label>
              <input name="precoDiaria" type="number" min="0.01" step="0.01" required
                defaultValue={equipment?.precoDiaria} placeholder="0,00" />
            </div>
          </div>

          {isEdit && (
            <div className="field">
              <label>Status</label>
              <select name="status" defaultValue={equipment?.status}>
                <option value="disponivel">Disponível</option>
                <option value="indisponivel">Indisponível</option>
              </select>
            </div>
          )}

          <div className="eq-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {isEdit ? 'Salvar alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
