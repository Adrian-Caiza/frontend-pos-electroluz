import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShoppingCart,
  Building2,
  WalletCards,
  Users,
  UserCog,
  Monitor,
  Package,
  Receipt,
  Pin,
  PinOff
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  onLogout: () => void;
  userImage?: string | null;
}

export const Sidebar = ({ onLogout, userImage }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem('sidebar_pinned');
    return saved === 'true';
  });

  const togglePin = () => {
    const newState = !isPinned;
    setIsPinned(newState);
    localStorage.setItem('sidebar_pinned', String(newState));
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['jefe'] },
    { name: 'Terminal POS', path: '/terminal', icon: Monitor, roles: ['jefe', 'empleado', 'cajero'] },
    { name: 'Historial Ventas', path: '/proformas', icon: Receipt, roles: ['jefe', 'empleado', 'cajero'] },
    { name: 'Sucursales', path: '/sucursales', icon: Building2, roles: ['jefe'] },
    { name: 'Caja', path: '/caja', icon: ShoppingCart, roles: ['jefe', 'cajero'] },
    { name: 'Inventario', path: '/stock', icon: PackageSearch, roles: ['jefe', 'empleado'] },
    { name: 'Productos', path: '/productos', icon: Package, roles: ['jefe'] },
    { name: 'Clientes', path: '/clientes', icon: Users, roles: ['jefe', 'empleado'] },
    { name: 'Métodos de Pago', path: '/metodos-pago', icon: WalletCards, roles: ['jefe', 'empleado'] },
    { name: 'Personal', path: '/usuarios', icon: UserCog, roles: ['jefe'] },
  ];

  const authorizedNavItems = navItems.filter((item) =>
    item.roles.includes(user?.usrol || '')
  );

  return (
    <aside className={cn(
      "group relative z-20 flex flex-col bg-transparent transition-all duration-300 ease-in-out hidden md:flex h-full",
      isPinned ? "w-64" : "w-20 hover:w-64"
    )}>
      {/* Header section (POS Icon) */}
      <div className="h-16 flex items-center px-5 overflow-hidden whitespace-nowrap shrink-0 relative">
        {/* Simple inline POS SVG instead of Lucide icon to match the plan */}
        <div className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="12" width="40" height="28" rx="4" fill="currentColor" fillOpacity="0.8"/>
            <rect x="16" y="16" width="32" height="14" rx="2" fill="white"/>
            <path d="M20 40L24 56H40L44 40H20Z" fill="currentColor" fillOpacity="0.6"/>
            <rect x="24" y="34" width="16" height="4" fill="currentColor"/>
            <circle cx="22" cy="36" r="2" fill="white"/>
            <circle cx="32" cy="36" r="2" fill="white"/>
            <circle cx="42" cy="36" r="2" fill="white"/>
            <path d="M30 56H34V60H30V56Z" fill="currentColor" fillOpacity="0.4"/>
          </svg>
        </div>
        <div className={cn(
          "flex items-center justify-between w-full ml-3 transition-opacity duration-300 delay-75",
          isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <span className="font-bold text-lg text-slate-800">
            My Workspace
          </span>
          <button
            onClick={togglePin}
            title={isPinned ? "Desfijar sidebar" : "Fijar sidebar"}
            className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors p-1 rounded-md"
          >
            {isPinned ? (
              <PinOff className="w-4 h-4" />
            ) : (
              <Pin className="w-4 h-4 -rotate-45" />
            )}
          </button>
        </div>
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
                  ? 'bg-white text-slate-800 font-semibold shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
              )}
            >
              <div className="flex items-center justify-center min-w-[32px]">
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-[22px] w-[22px] transition-transform duration-200 group-hover/item:scale-110',
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover/item:text-slate-600'
                  )}
                  aria-hidden="true"
                />
              </div>
              <span className={cn(
                "ml-3 text-[15px] transition-opacity duration-300 delay-75",
                isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 shrink-0">
        <div className="flex items-center px-2 py-3 rounded-xl overflow-hidden whitespace-nowrap mb-2">
          {/* Avatar */}
          <div className="flex items-center justify-center min-w-[32px] w-[32px] h-[32px] rounded-full ring-2 ring-emerald-500/20 overflow-hidden bg-white shrink-0 shadow-sm border border-slate-200">
            {userImage ? (
              <img src={userImage} alt={user?.usnombre || 'User'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-emerald-600 font-bold text-sm uppercase">
                {user?.usnombre?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          
          {/* User Details */}
          <div className={cn(
            "ml-3 flex flex-col transition-opacity duration-300 delay-75 overflow-hidden",
            isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <span className="text-[14px] text-slate-800 font-semibold truncate leading-tight">
              {user?.usnombre || 'Usuario'}
            </span>
            <span className="text-[12px] text-slate-500 truncate leading-tight mt-0.5">
              {user?.uscorreo || 'correo@empresa.com'}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase mt-1 bg-emerald-100 w-max px-1.5 py-0.5 rounded-md">
              {user?.usrol || 'Rol'}
            </span>
          </div>
        </div>

        {/* Log Out */}
        <button
          onClick={onLogout}
          title="Cerrar Sesión"
          className="w-full flex items-center px-3 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-red-600 transition-colors duration-200 overflow-hidden whitespace-nowrap group/logout shadow-sm border border-transparent hover:border-red-100"
        >
          <div className="flex items-center justify-center min-w-[32px]">
            <LogOut className="flex-shrink-0 h-[22px] w-[22px] transition-transform duration-200 group-hover/logout:-translate-x-1" />
          </div>
          <span className={cn(
            "ml-3 text-[15px] font-medium transition-opacity duration-300 delay-75",
            isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            Cerrar Sesión
          </span>
        </button>
      </div>

      {/* Custom Scrollbar CSS for light mode */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 4px;
        }
        .group:hover .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; /* slate-300 */
        }
        .group:hover .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; /* slate-400 */
        }
      `}</style>
    </aside>
  );
};
