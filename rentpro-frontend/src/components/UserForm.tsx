import { useState } from 'react';
import type { FormEvent } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';
import { UserRole } from '../types/roles';

interface Props {
  initialData?: User;
  onSave(data: CreateUserRequest | UpdateUserRequest): Promise<void>;
  onCancel(): void;
}

export function UserForm({ initialData, onSave, onCancel }: Props) {
  const isEdit = !!initialData;

  const [nome, setNome] = useState(initialData?.nome ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState<UserRole>(initialData?.tipo ?? UserRole.CLIENTE);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        const data: UpdateUserRequest = { nome, email, tipo };
        if (senha) data.senha = senha;
        await onSave(data);
      } else {
        await onSave({ nome, email, senha, tipo });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <label>
        Nome
        <input
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          required
        />
      </label>

      <label>
        E-mail
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label>
        Senha {isEdit && '(deixe em branco para manter a atual)'}
        <input
          type="password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          minLength={6}
          required={!isEdit}
        />
      </label>

      <label>
        Perfil
        <select value={tipo} onChange={(event) => setTipo(event.target.value as UserRole)}>
          <option value={UserRole.CLIENTE}>Cliente</option>
          <option value={UserRole.ADMIN}>Admin</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
