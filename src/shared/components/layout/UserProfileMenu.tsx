import { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogOut, ChevronsUpDown } from 'lucide-react';
import { ProfileSettingsModal } from '../../../modules/usuario/presentation/components/ProfileSettingsModal';

interface UserProfileMenuProps {
  onLogout: () => void;
  userImage?: string | null;
}

export const UserProfileMenu = ({ onLogout, userImage }: UserProfileMenuProps) => {
  const { user } = useAuthStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center p-1.5 rounded-full hover:bg-muted border border-border/50 shadow-sm transition-colors outline-none ring-0 text-left">
            <div className="flex items-center overflow-hidden">
              {/* Avatar */}
              <div className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden bg-primary/10 shrink-0 border border-primary/20">
                {userImage ? (
                  <img src={userImage} alt={user?.usnombre || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary font-bold text-sm uppercase">
                    {user?.usnombre?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              
              {/* User Details */}
              <div className="hidden sm:flex flex-col text-left ml-2.5 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-foreground font-semibold truncate leading-tight">
                    {user?.usnombre || 'Usuario'}
                  </span>
                  <span className="text-[10px] text-primary-foreground font-bold tracking-wider uppercase bg-primary px-1.5 py-0.5 rounded-md">
                    {user?.usrol || 'Rol'}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5 max-w-[120px]">
                  {user?.uscorreo || 'correo@empresa.com'}
                </span>
              </div>
            </div>

            {/* Chevrons */}
            <div className="ml-2 text-muted-foreground/60 hidden sm:block">
              <ChevronsUpDown className="w-4 h-4" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuItem 
            onClick={() => setIsProfileModalOpen(true)}
            className="cursor-pointer rounded-lg text-muted-foreground hover:text-foreground focus:text-foreground p-2.5"
          >
            <span>Configuración de Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onLogout}
            className="cursor-pointer rounded-lg text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/50 focus:text-rose-700 dark:focus:text-rose-400 p-2.5 mt-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="font-medium">Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileSettingsModal 
        open={isProfileModalOpen} 
        onOpenChange={setIsProfileModalOpen} 
      />
    </>
  );
};
