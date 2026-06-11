import { useState } from 'react';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { Building2 } from 'lucide-react';

export const DashboardHeader = () => {
  const { user, company } = useAuthStore();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Panel de Control - {company?.emrznsocial || 'Ferretería'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido de vuelta, {user?.usnombre}. RUC: {company?.emruc || 'N/A'}
        </p>
      </div>
    </div>
  );
};
