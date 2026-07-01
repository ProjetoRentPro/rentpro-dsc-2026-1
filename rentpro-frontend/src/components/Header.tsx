import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './Header.css';

export function Header() {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <span className="header-logo">📦</span>
          <span className="header-name">RentPro</span>
        </Link>

        <nav className="header-nav">
          <a href="/#sobre">Sobre</a>
          <a href="/#equipamentos">Equipamentos</a>
          <a href="/#contato">Contato</a>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link className="btn-login" to="/dashboard">
                Minha área
              </Link>
              <button className="btn-logout" onClick={signOut}>
                Sair
              </button>
            </>
          ) : (
            <Link className="btn-login" to="/login">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
