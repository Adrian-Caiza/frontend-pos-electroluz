import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { FluentPeopleTeam20Filled, FluentPeopleAdd16Filled } from '../../shared/components/icons/icons';
import { Button } from '../../shared/components/ui/button';
import { ClienteTable } from '../../modules/cliente/presentation/components/ClienteTable';
import { CreateClienteModal } from '../../modules/cliente/presentation/components/CreateClienteModal';

export const ClientesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-rose-500/20 dark:from-orange-500/10 dark:to-rose-500/10 rounded-2xl border border-orange-500/20 shadow-sm flex items-center justify-center">
            <FluentPeopleTeam20Filled className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Directorio de Clientes
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Administra los clientes y compradores de tu empresa
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FluentPeopleAdd16Filled className="w-5 h-5 mr-2" />
          Registrar Cliente
        </Button>
      </div>

      <ClienteTable />

      <CreateClienteModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};
