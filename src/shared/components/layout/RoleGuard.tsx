import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !user.usrol) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.usrol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
