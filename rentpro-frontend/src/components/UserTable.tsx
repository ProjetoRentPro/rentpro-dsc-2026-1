import type { User } from '../types/user';
import { UserRow } from './UserRow';

interface Props {
  users: User[];
  onEdit(user: User): void;
  onDelete(id: number): void;
}

export function UserTable({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return <p>Nenhum usuário encontrado.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Perfil</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}
