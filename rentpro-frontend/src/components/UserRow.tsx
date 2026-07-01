import type { User } from '../types/user';

interface Props {
  user: User;
  onEdit(user: User): void;
  onDelete(id: number): void;
}

export function UserRow({ user, onEdit, onDelete }: Props) {
  return (
    <tr>
      <td>{user.nome}</td>
      <td>{user.email}</td>
      <td>{user.tipo}</td>
      <td>
        <button className="btn-edit" onClick={() => onEdit(user)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => onDelete(user.id)}>
          Excluir
        </button>
      </td>
    </tr>
  );
}
