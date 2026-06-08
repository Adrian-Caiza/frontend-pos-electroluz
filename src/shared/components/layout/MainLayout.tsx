import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  const { user, company, refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();

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

  const getImageUrl = (rawPath: string | null | undefined) => {
    if (!rawPath || rawPath === 'null' || rawPath === 'undefined' || rawPath.trim() === '') return null;
    
    const imagePath = rawPath.replace(/\\/g, '/');
    if (imagePath.startsWith('blob:')) return imagePath;

    if (imagePath.startsWith('http')) {
      try {
        const url = new URL(imagePath);
        const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
        const isApiHost = import.meta.env.VITE_API_URL && url.hostname === new URL(import.meta.env.VITE_API_URL).hostname;
        const isKnownIP = url.hostname === '163.245.192.54';
        
        if (isLocalhost || isApiHost || isKnownIP) {
          return `/api-proxy${url.pathname}`;
        }
        return imagePath;
      } catch (e) {
        return imagePath;
      }
    }
    
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `/api-proxy${path}`;
  };

  const userImage = getImageUrl(user?.usimagen as string | undefined);
  const companyLogo = getImageUrl(company?.emlogo as string | undefined);

  return (
    <div className="h-screen w-full bg-slate-100 flex overflow-hidden p-2 md:p-4 gap-4">
      <Sidebar 
        onLogout={handleLogout} 
        userImage={userImage} 
        companyName={company?.emrznsocial}
        companyLogo={companyLogo}
      />

      {/* Main Content Card */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200/60">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-between px-6 shrink-0 rounded-t-3xl border-b border-slate-100 md:hidden">
          <div className="flex items-center">
            <span className="font-bold text-lg text-slate-800">
              {company?.emrznsocial || 'POS App'}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-white p-6 rounded-b-3xl">
          <div className="w-full max-w-[1600px] mx-auto min-h-full flex flex-col pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
