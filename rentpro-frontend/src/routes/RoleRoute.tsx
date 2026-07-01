import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import type { UserRole } from '../types/roles';

interface Props {
  roles: UserRole[];
}

export function RoleRoute({ roles }: Props) {
  const { user } = useAuth();
  const hasPermission = user && roles.includes(user.tipo);

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
