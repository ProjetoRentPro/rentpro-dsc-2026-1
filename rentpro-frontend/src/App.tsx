import { Header } from './components/Header';
import { EquipmentDashboard } from './components/EquipmentDashboard';
import { useAuth } from './hooks/useAuth';
import './App.css';

export default function App() {
  const { isAuthenticated, token, user, saveToken, logout } = useAuth();

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={saveToken}
        onLogout={logout}
      />

      <main className="main">
        {isAuthenticated && token && user ? (
          <EquipmentDashboard token={token} userId={user.sub} />
        ) : (
          <>
            {/* Hero */}
            <section className="hero">
              <div className="hero-content">
                <span className="hero-badge">Aluguel de equipamentos</span>
                <h1 className="hero-title">
                  Locação de equipamentos<br />
                  <span className="hero-highlight">simples e eficiente</span>
                </h1>
                <p className="hero-subtitle">
                  Encontre e alugue equipamentos de qualidade com segurança e praticidade.
                  Cadastre-se gratuitamente e comece agora.
                </p>
                <p className="hero-cta-hint">
                  Clique em <strong>Entrar</strong> no canto superior direito para criar sua conta ou fazer login.
                </p>
              </div>
              <div className="hero-illustration" aria-hidden>📦</div>
            </section>

            {/* Sobre */}
            <section id="sobre" className="section">
              <h2>Sobre o RentPro</h2>
              <p>
                Plataforma de gestão de locação de equipamentos desenvolvida para
                conectar proprietários e clientes de forma ágil, segura e transparente.
              </p>
            </section>

            {/* Equipamentos */}
            <section id="equipamentos" className="section section-alt">
              <h2>Equipamentos disponíveis</h2>
              <div className="cards">
                {['Furadeiras', 'Andaimes', 'Compressores', 'Geradores'].map((item) => (
                  <div key={item} className="card">
                    <div className="card-icon">🔧</div>
                    <h3>{item}</h3>
                    <p>Equipamentos de qualidade com manutenção em dia.</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contato */}
            <section id="contato" className="section">
              <h2>Contato</h2>
              <p>Dúvidas? Entre em contato: <a href="mailto:contato@rentpro.com">contato@rentpro.com</a></p>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} RentPro. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
