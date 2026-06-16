import { useState, useEffect, useRef } from 'react';
import { authService } from '../services/auth.service';
import type { ApiError } from '../services/auth.service';
import './AuthModal.css';

type View = 'login' | 'register' | 'forgot';

interface Props {
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export function AuthModal({ onClose, onSuccess }: Props) {
  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const backdropRef = useRef<HTMLDivElement>(null);

  // Fechar com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  function clearMessages() {
    setError('');
    setSuccess('');
  }

  function switchView(v: View) {
    clearMessages();
    setView(v);
  }

  // --- LOGIN ---
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearMessages();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const senha = (form.elements.namedItem('senha') as HTMLInputElement).value;

    setLoading(true);
    try {
      const { access_token } = await authService.login({ email, senha });
      onSuccess(access_token);
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message ?? 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  // --- REGISTRO ---
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearMessages();
    const form = e.currentTarget;
    const nome = (form.elements.namedItem('nome') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const senha = (form.elements.namedItem('senha') as HTMLInputElement).value;
    const confirmar = (form.elements.namedItem('confirmar') as HTMLInputElement).value;

    if (senha !== confirmar) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await authService.register({ nome, email, senha, tipo: 'cliente' });
      setSuccess('Conta criada com sucesso! Faça login para continuar.');
      setTimeout(() => switchView('login'), 1800);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message ?? 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  // --- RECUPERAR SENHA ---
  async function handleForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    // Placeholder — endpoint ainda não implementado no backend
    await new Promise((r) => setTimeout(r, 800));
    setSuccess('Se o e-mail existir, você receberá as instruções em breve.');
    setLoading(false);
  }

  const titles: Record<View, string> = {
    login: 'Entrar na conta',
    register: 'Criar conta',
    forgot: 'Recuperar senha',
  };

  return (
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdrop}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        <div className="modal-logo">
          <span className="logo-icon">📦</span>
          <span className="logo-text">RentPro</span>
        </div>

        <h2 className="modal-title">{titles[view]}</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {view === 'login' && (
          <form onSubmit={handleLogin} className="modal-form">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" required placeholder="seu@email.com" />
            </div>
            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input id="senha" name="senha" type="password" required placeholder="••••••" minLength={6} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
            <div className="modal-links">
              <button type="button" className="link" onClick={() => switchView('forgot')}>
                Esqueci minha senha
              </button>
              <button type="button" className="link" onClick={() => switchView('register')}>
                Criar conta
              </button>
            </div>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} className="modal-form">
            <div className="field">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" name="nome" type="text" required placeholder="João Silva" />
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" required placeholder="seu@email.com" />
            </div>
            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input id="senha" name="senha" type="password" required placeholder="Mínimo 6 caracteres" minLength={6} />
            </div>
            <div className="field">
              <label htmlFor="confirmar">Confirmar senha</label>
              <input id="confirmar" name="confirmar" type="password" required placeholder="Repita a senha" minLength={6} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Criando conta…' : 'Criar conta'}
            </button>
            <div className="modal-links">
              <button type="button" className="link" onClick={() => switchView('login')}>
                Já tenho conta
              </button>
            </div>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgot} className="modal-form">
            <p className="modal-hint">
              Informe seu e-mail cadastrado e enviaremos as instruções para redefinir sua senha.
            </p>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" required placeholder="seu@email.com" />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar instruções'}
            </button>
            <div className="modal-links">
              <button type="button" className="link" onClick={() => switchView('login')}>
                Voltar ao login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
