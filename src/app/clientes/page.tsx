import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import { ClienteTable } from '../../modules/cliente/presentation/components/ClienteTable';
import { CreateClienteModal } from '../../modules/cliente/presentation/components/CreateClienteModal';

export const ClientesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Directorio de Clientes</h1>
          <p className="text-slate-500 mt-1">
            Administra los clientes y compradores de tu empresa
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
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
