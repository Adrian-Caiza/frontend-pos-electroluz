import { useState } from 'react';
import { Button } from '../../shared/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import { ClarityEmployeeSolid, WpfAddUser } from '../../shared/components/icons/icons';
import { UsuarioTable } from '../../modules/usuario/presentation/components/UsuarioTable';
import { CreateUsuarioModal } from '../../modules/usuario/presentation/components/CreateUsuarioModal';

export default function UsuariosPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 dark:from-indigo-500/10 dark:to-blue-500/10 rounded-2xl border border-indigo-500/20 shadow-sm flex items-center justify-center">
            <ClarityEmployeeSolid className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Personal
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Gestiona los usuarios y roles operativos de tu empresa
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <WpfAddUser className="w-5 h-5 mr-2" />
          Registrar Usuario
        </Button>
      </div>

      <div className="w-full bg-transparent rounded-xl">
        <UsuarioTable />
      </div>
      <CreateUsuarioModal 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />
    </div>
  );
}
