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
  PinOff,
  ChevronsUpDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  onLogout: () => void;
  userImage?: string | null;
  companyName?: string;
  companyLogo?: string | null;
}

export const Sidebar = ({ onLogout, userImage, companyName, companyLogo }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem('sidebar_pinned');
    return saved === 'true';
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isExpanded = isPinned || isDropdownOpen;

  const togglePin = () => {
    const newState = !isPinned;
    setIsPinned(newState);
    localStorage.setItem('sidebar_pinned', String(newState));
  };

  const navGroups = [
    {
      group: 'Principal',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['jefe'] },
      ]
    },
    {
      group: 'Ventas y Caja',
      items: [
        { name: 'Terminal POS', path: '/terminal', icon: Monitor, roles: ['jefe', 'empleado', 'cajero'] },
        { name: 'Historial Ventas', path: '/proformas', icon: Receipt, roles: ['jefe', 'empleado', 'cajero'] },
        { name: 'Caja', path: '/caja', icon: ShoppingCart, roles: ['jefe', 'cajero'] },
        { name: 'Clientes', path: '/clientes', icon: Users, roles: ['jefe', 'empleado'] },
      ]
    },
    {
      group: 'Catálogo e Inventario',
      items: [
        { name: 'Productos', path: '/productos', icon: Package, roles: ['jefe'] },
        { name: 'Inventario', path: '/stock', icon: PackageSearch, roles: ['jefe', 'empleado'] },
      ]
    },
    {
      group: 'Administración',
      items: [
        { name: 'Personal', path: '/usuarios', icon: UserCog, roles: ['jefe'] },
        { name: 'Sucursales', path: '/sucursales', icon: Building2, roles: ['jefe'] },
        { name: 'Métodos de Pago', path: '/metodos-pago', icon: WalletCards, roles: ['jefe', 'empleado'] },
      ]
    }
  ];

  const authorizedNavGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(user?.usrol || ''))
  })).filter(group => group.items.length > 0);

  return (
    <aside className={cn(
      "group relative z-20 flex flex-col bg-transparent transition-all duration-300 ease-in-out hidden md:flex h-full",
      isExpanded ? "w-56" : "w-[72px] hover:w-56"
    )}>
      {/* Header section (Company Logo) */}
      <div className="h-16 flex items-center px-4 overflow-hidden shrink-0 relative">
        {companyLogo ? (
          <div className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white shrink-0 p-1">
            <img src={companyLogo} alt={companyName || 'Logo'} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="12" width="40" height="28" rx="4" fill="currentColor" fillOpacity="0.8" />
              <rect x="16" y="16" width="32" height="14" rx="2" fill="white" />
              <path d="M20 40L24 56H40L44 40H20Z" fill="currentColor" fillOpacity="0.6" />
              <rect x="24" y="34" width="16" height="4" fill="currentColor" />
              <circle cx="22" cy="36" r="2" fill="white" />
              <circle cx="32" cy="36" r="2" fill="white" />
              <circle cx="42" cy="36" r="2" fill="white" />
              <path d="M30 56H34V60H30V56Z" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
        )}
        <div className={cn(
          "flex items-center justify-between w-[130px] shrink-0 ml-3 transition-opacity duration-300 delay-75",
          isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <span className="font-bold text-[15px] text-slate-800 leading-tight whitespace-normal line-clamp-2 break-words">
            {companyName || 'My Workspace'}
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

      {/* Top Separator */}
      <div className="px-4 shrink-0">
        <div className="h-px w-full bg-slate-300 rounded-full" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto py-4 px-3 space-y-4 flex flex-col custom-scrollbar">
        {authorizedNavGroups.map((group, index) => (
          <div key={group.group} className="flex flex-col space-y-0.5">
            <div className="relative flex items-center justify-center mb-0.5 min-h-[16px]">
              {/* Separador visible solo cuando está colapsado */}
              {index > 0 && (
                <div className={cn(
                  "absolute h-[2px] w-8 bg-slate-300 rounded-full transition-all duration-300",
                  isExpanded ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100 group-hover:opacity-0 group-hover:scale-x-0"
                )} />
              )}
              {/* Texto de cabecera visible cuando está expandido */}
              <div className={cn(
                "w-full px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase transition-opacity duration-300 whitespace-nowrap",
                isExpanded ? "opacity-100 delay-75" : "opacity-0 group-hover:opacity-100 group-hover:delay-75"
              )}>
                {group.group}
              </div>
            </div>
            {group.items.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={cn(
                    'flex items-center py-2 rounded-xl transition-all duration-200 overflow-hidden whitespace-nowrap group/item',
                    isExpanded ? 'px-3' : 'px-2 group-hover:px-3',
                    isActive
                      ? 'bg-white text-slate-800 font-semibold shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
                  )}
                >
                  <div className="flex items-center justify-center min-w-[32px]">
                    <item.icon
                      className={cn(
                        'flex-shrink-0 h-[20px] w-[20px] transition-transform duration-200 group-hover/item:scale-110',
                        isActive ? 'text-emerald-600' : 'text-slate-400 group-hover/item:text-slate-600'
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={cn(
                    "transition-all duration-300 overflow-hidden whitespace-nowrap flex items-center",
                    isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-3"
                  )}>
                    <span className={cn(
                      "text-[13px]",
                      isActive ? "font-bold" : "font-medium"
                    )}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Separator */}
      <div className="px-4 shrink-0">
        <div className="h-px w-full bg-slate-300 rounded-full" />
      </div>

      {/* User Section */}
      <div className={cn(
        "shrink-0 mt-auto flex flex-col space-y-2 transition-all duration-300",
        isExpanded ? "p-3" : "p-2"
      )}>
        <DropdownMenu onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/60 shadow-sm transition-colors outline-none ring-0 group/user text-left">
              <div className="flex items-center overflow-hidden">
                {/* Avatar */}
                <div className="flex items-center justify-center min-w-[36px] w-[36px] h-[36px] rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/50">
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
                  "flex flex-col text-left transition-all duration-300 delay-75 overflow-hidden",
                  isExpanded ? "w-[100px] ml-2.5 opacity-100" : "w-0 ml-0 opacity-0 group-hover:w-[100px] group-hover:ml-2.5 group-hover:opacity-100"
                )}>
                  <span className="text-[13px] text-slate-800 font-semibold truncate leading-tight">
                    {user?.usnombre || 'Usuario'}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                    {user?.uscorreo || 'correo@empresa.com'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold tracking-wider uppercase mt-1.5 bg-emerald-100 w-max px-2 py-0.5 rounded-md">
                    {user?.usrol || 'Rol'}
                  </span>
                </div>
              </div>

              {/* Chevrons */}
              <div className={cn(
                "ml-auto transition-all duration-300 delay-75 text-slate-400 overflow-hidden shrink-0",
                isExpanded ? "w-4 px-1 opacity-100" : "w-0 px-0 opacity-0 group-hover:w-4 group-hover:px-1 group-hover:opacity-100"
              )}>
                <ChevronsUpDown className="w-4 h-4" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" sideOffset={16} className="w-56 rounded-xl">
            <DropdownMenuItem className="cursor-pointer rounded-lg text-slate-600">
              <span>Configuración de Perfil</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
            isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
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
