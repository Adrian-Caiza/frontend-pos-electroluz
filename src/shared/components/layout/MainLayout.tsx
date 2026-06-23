import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Menu } from 'lucide-react';

import { Sidebar } from './Sidebar';
import { AlertBell } from '../../../modules/alert/presentation/components/AlertBell';
import { ThemeToggle } from '../ui/theme-toggle';
import { UserProfileMenu } from './UserProfileMenu';
import { getImageUrl } from '../../utils/getImageUrl';
import { Breadcrumbs } from '../ui/breadcrumb';

export const MainLayout = () => {
  const { user, company, refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    // 1. Instanciar dependencias (Idealmente esto vendría de un contenedor DI o un hook)
    const { AuthRepository } = await import('../../../modules/auth/infrastructure/repositories/AuthRepository');
    const { LogoutUseCase } = await import('../../../modules/auth/application/use-cases/LogoutUseCase');
    
    const repository = new AuthRepository();
    const useCase = new LogoutUseCase(repository);

    // 2. Ejecutar caso de uso (API call)
    if (refreshToken) {
      await useCase.execute(refreshToken);
    }

    // 3. Limpiar estado local y redirigir
    logout();
    navigate('/auth/login');
  };



  const userImage = getImageUrl(user?.usimagen as string | undefined);
  const companyLogo = getImageUrl(company?.emlogo as string | undefined);

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden p-1 sm:p-2 md:p-4 gap-2 sm:gap-4">
      <Sidebar 
        companyName={company?.emrznsocial}
        companyLogo={companyLogo}
        isMobileOpen={isMobileSidebarOpen}
        onMobileOpenChange={setIsMobileSidebarOpen}
      />

      {/* Main Content Card */}
      <div className="flex-1 flex flex-col overflow-hidden bg-card text-card-foreground rounded-3xl shadow-sm border border-border/60">
        {/* Subtle Top Bar */}
        <header className="h-14 bg-card flex items-center justify-between px-3 sm:px-6 shrink-0 rounded-t-3xl border-b border-border/60 z-10">
          {/* Mobile Company Name & Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted text-card-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg text-card-foreground">
              {company?.emrznsocial || 'POS App'}
            </span>
          </div>
          
          {/* Desktop Spacer & Breadcrumbs */}
          <div className="hidden md:flex flex-1 items-center">
            <Breadcrumbs />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 ml-auto">
            <ThemeToggle />
            <AlertBell />
            <UserProfileMenu onLogout={handleLogout} userImage={userImage} />
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-card p-3 sm:p-6 rounded-b-3xl">
          <div className="w-full max-w-[1600px] mx-auto min-h-full flex flex-col pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
