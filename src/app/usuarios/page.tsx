import { useState } from 'react';
import { Button } from '../../shared/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import { UsuarioTable } from '../../modules/usuario/presentation/components/UsuarioTable';
import { CreateUsuarioModal } from '../../modules/usuario/presentation/components/CreateUsuarioModal';

export default function UsuariosPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Personal</h1>
          <p className="text-muted-foreground">Gestiona los usuarios y roles operativos de tu empresa</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <UserPlus className="w-4 h-4 mr-2" />
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
