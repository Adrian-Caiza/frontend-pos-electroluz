import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard = ({ children }: GuestGuardProps) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // If there's a token, redirect to their respective dashboard
  if (token && user) {
    if (user.usrol === 'jefe') return <Navigate to="/dashboard" replace />;
    if (user.usrol === 'cajero') return <Navigate to="/caja" replace />;
    if (user.usrol === 'empleado') return <Navigate to="/terminal" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
