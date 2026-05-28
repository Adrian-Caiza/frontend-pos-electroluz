import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShoppingCart,
  Building2,
  WalletCards,
  Users,
  Monitor,
  Receipt
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar = ({ onLogout }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['jefe'] },
    { name: 'Terminal POS', path: '/terminal', icon: Monitor, roles: ['jefe', 'empleado', 'cajero'] },
    { name: 'Historial Ventas', path: '/proformas', icon: Receipt, roles: ['jefe', 'empleado', 'cajero'] },
    { name: 'Sucursales', path: '/sucursales', icon: Building2, roles: ['jefe'] },
    { name: 'Caja', path: '/caja', icon: ShoppingCart, roles: ['jefe', 'cajero'] },
    { name: 'Inventario', path: '/stock', icon: PackageSearch, roles: ['jefe', 'empleado'] },
    { name: 'Productos', path: '/productos', icon: PackageSearch, roles: ['jefe'] },
    { name: 'Clientes', path: '/clientes', icon: Users, roles: ['jefe', 'empleado'] },
    { name: 'Métodos de Pago', path: '/metodos-pago', icon: WalletCards, roles: ['jefe', 'empleado'] },
    { name: 'Usuarios', path: '/usuarios', icon: Users, roles: ['jefe'] },
  ];

  const authorizedNavItems = navItems.filter((item) =>
    item.roles.includes(user?.usrol || '')
  );

  return (
    <aside className="group relative z-20 flex flex-col bg-[#0d1b2a] text-slate-300 w-20 hover:w-64 transition-all duration-300 ease-in-out border-r border-[#1a2f4c] hidden md:flex h-full shadow-2xl">
      {/* Header section (POS Icon) */}
      <div className="h-16 flex items-center px-5 border-b border-[#1a2f4c] overflow-hidden whitespace-nowrap shrink-0">
        {/* Simple inline POS SVG instead of Lucide icon to match the plan */}
        <div className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-lg bg-[#00e676]/10 text-[#00e676]">
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="12" width="40" height="28" rx="4" fill="currentColor" fillOpacity="0.8"/>
            <rect x="16" y="16" width="32" height="14" rx="2" fill="#0d1b2a"/>
            <path d="M20 40L24 56H40L44 40H20Z" fill="currentColor" fillOpacity="0.6"/>
            <rect x="24" y="34" width="16" height="4" fill="currentColor"/>
            <circle cx="22" cy="36" r="2" fill="#0d1b2a"/>
            <circle cx="32" cy="36" r="2" fill="#0d1b2a"/>
            <circle cx="42" cy="36" r="2" fill="#0d1b2a"/>
            <path d="M30 56H34V60H30V56Z" fill="currentColor" fillOpacity="0.4"/>
          </svg>
        </div>
        <span className="font-bold text-lg text-white ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          My Workspace
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto py-6 px-3 space-y-2 flex flex-col custom-scrollbar">
        {authorizedNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.name}
              className={cn(
                'flex items-center px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden whitespace-nowrap group/item',
                isActive
                  ? 'bg-[#00e676] text-[#0d1b2a] shadow-[0_0_15px_rgba(0,230,118,0.4)]'
                  : 'text-slate-400 hover:bg-[#1a2f4c] hover:text-[#00e676]'
              )}
            >
              <div className="flex items-center justify-center min-w-[32px]">
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-[22px] w-[22px] transition-transform duration-200 group-hover/item:scale-110',
                    isActive ? 'text-[#0d1b2a]' : 'text-slate-400 group-hover/item:text-[#00e676]'
                  )}
                  aria-hidden="true"
                />
              </div>
              <span className={cn(
                "ml-3 text-[15px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75",
                isActive ? "text-[#0d1b2a] font-bold" : ""
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section (Log Out) */}
      <div className="p-3 border-t border-[#1a2f4c] shrink-0">
        <button
          onClick={onLogout}
          title="Cerrar Sesión"
          className="w-full flex items-center px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 overflow-hidden whitespace-nowrap group/logout"
        >
          <div className="flex items-center justify-center min-w-[32px]">
            <LogOut className="flex-shrink-0 h-[22px] w-[22px] transition-transform duration-200 group-hover/logout:-translate-x-1" />
          </div>
          <span className="ml-3 text-[15px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            Cerrar Sesión
          </span>
        </button>
      </div>

      {/* Custom Scrollbar CSS for this specific container to make it look sleek in dark mode */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a2f4c;
          border-radius: 4px;
        }
        .group:hover .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a3f5c;
        }
      `}</style>
    </aside>
  );
};
