import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../auth/useAuth';
import { getErrorMessage } from '../utils/getErrorMessage';
import { ErrorMessage } from '../components/ErrorMessage';

export function LoginPage() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !senha.trim()) {
      setErrorMessage('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const result = await login({ email, senha });
      await signIn(result.access_token);
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="auth-card">
        <h1>Login</h1>
        <p>Informe suas credenciais para acessar o RentPro.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Sua senha"
            />
          </label>

          {errorMessage && <ErrorMessage message={errorMessage} />}

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="modal-links">
          <Link to="/register">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}
