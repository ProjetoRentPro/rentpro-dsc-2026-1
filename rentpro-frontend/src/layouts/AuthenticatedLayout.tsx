import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { UserRole } from '../types/roles';

export function AuthenticatedLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/login');
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">RentPro</h2>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>

          {user?.tipo === UserRole.ADMIN && (
            <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
              Usuários
            </NavLink>
          )}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="user-info">
            <strong>{user?.nome}</strong>
            <span>{user?.tipo}</span>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
