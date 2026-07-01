import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export function PublicLayout() {
  return (
    <>
      <Header />

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} RentPro. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
