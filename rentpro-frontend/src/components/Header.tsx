import { useState } from 'react';
import { AuthModal } from './AuthModal';
import './Header.css';

interface Props {
  isAuthenticated: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
}

export function Header({ isAuthenticated, onLogin, onLogout }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="/" className="header-brand">
            <span className="header-logo">📦</span>
            <span className="header-name">RentPro</span>
          </a>

          <nav className="header-nav">
            <a href="#sobre">Sobre</a>
            <a href="#equipamentos">Equipamentos</a>
            <a href="#contato">Contato</a>
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <button className="btn-logout" onClick={onLogout}>
                Sair
              </button>
            ) : (
              <button className="btn-login" onClick={() => setShowModal(true)}>
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onSuccess={onLogin}
        />
      )}
    </>
  );
}
