import { useAuth } from '../auth/useAuth';
import { EquipmentDashboard } from '../components/EquipmentDashboard';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="content-card">
      <h1>Dashboard</h1>
      <p>
        Bem-vindo, {user?.nome}. Perfil: {user?.tipo}
      </p>

      <EquipmentDashboard />
    </section>
  );
}
