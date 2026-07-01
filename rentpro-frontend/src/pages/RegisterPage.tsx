import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../api/usersApi';
import { UserRole } from '../types/roles';
import { getErrorMessage } from '../utils/getErrorMessage';
import { ErrorMessage } from '../components/ErrorMessage';

export function RegisterPage() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (senha !== confirmar) {
      setErrorMessage('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      await createUser({ nome, email, senha, tipo: UserRole.CLIENTE });
      setSuccessMessage('Conta criada com sucesso! Redirecionando para o login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="auth-card">
        <h1>Criar conta</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Nome completo
            <input type="text" value={nome} onChange={(event) => setNome(event.target.value)} required />
          </label>

          <label>
            E-mail
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              minLength={6}
              required
            />
          </label>

          <label>
            Confirmar senha
            <input
              type="password"
              value={confirmar}
              onChange={(event) => setConfirmar(event.target.value)}
              minLength={6}
              required
            />
          </label>

          {errorMessage && <ErrorMessage message={errorMessage} />}
          {successMessage && <p className="success">{successMessage}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p className="modal-links">
          <Link to="/login">Já tenho conta</Link>
        </p>
      </section>
    </main>
  );
}
