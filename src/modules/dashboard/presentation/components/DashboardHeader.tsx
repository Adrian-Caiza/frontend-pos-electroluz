import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { Building2 } from 'lucide-react';

export const DashboardHeader = () => {
  const { user, company } = useAuthStore();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Panel de Control - {company?.emrznsocial || 'Ferretería'}
        </h1>
        <p className="text-slate-500 mt-1">
          Bienvenido de vuelta, {user?.usnombre}. RUC: {company?.emruc || 'N/A'}
        </p>
      </div>
      
      {company?.emlogo ? (
        <div className="hidden md:block">
          <img 
            src={company.emlogo} 
            alt={company.emrznsocial} 
            className="h-12 object-contain bg-white rounded shadow-sm px-2 py-1 border border-slate-100" 
          />
        </div>
      ) : (
        <div className="hidden md:flex items-center justify-center w-12 h-12 bg-slate-100 rounded-lg text-slate-400">
          <Building2 className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
