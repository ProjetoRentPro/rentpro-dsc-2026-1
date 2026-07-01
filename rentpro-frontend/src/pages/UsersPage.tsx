import { useEffect, useState, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/usersApi';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';
import { UserTable } from '../components/UserTable';
import { UserForm } from '../components/UserForm';
import { ErrorMessage } from '../components/ErrorMessage';
import { getErrorMessage } from '../utils/getErrorMessage';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleNew() {
    setSelectedUser(null);
    setShowForm(true);
  }

  function handleEdit(user: User) {
    setSelectedUser(user);
    setShowForm(true);
  }

  async function handleSave(data: CreateUserRequest | UpdateUserRequest) {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data as UpdateUserRequest);
      } else {
        await createUser(data as CreateUserRequest);
      }
      setShowForm(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function handleDelete(id: number) {
    const confirmed = confirm('Deseja realmente excluir este usuário?');
    if (!confirmed) return;

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <section className="content-card">
      <div className="page-header">
        <h1>Usuários</h1>
        <button className="btn-primary" onClick={handleNew}>
          + Novo usuário
        </button>
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {showForm && (
        <UserForm
          initialData={selectedUser ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
        />
      )}

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </section>
  );
}
