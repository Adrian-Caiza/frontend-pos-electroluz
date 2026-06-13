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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsUpDown,
  FolderTree,
  Tag,
  Scale,
  Archive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  companyName?: string;
  companyLogo?: string | null;
}

export const Sidebar = ({ companyName, companyLogo }: SidebarProps) => {
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
        { name: 'Categorías', path: '/categorias', icon: FolderTree, roles: ['jefe'] },
        { name: 'Marcas', path: '/marcas', icon: Tag, roles: ['jefe'] },
        { name: 'Medidas', path: '/medidas', icon: Scale, roles: ['jefe', 'empleado'] },
        { name: 'Inventario', path: '/stock', icon: Archive, roles: ['jefe', 'empleado'] },
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
      "group relative z-20 flex flex-col bg-sidebar rounded-3xl transition-all duration-300 ease-in-out hidden md:flex h-full",
      isExpanded ? "w-56" : "w-[72px] hover:w-56"
    )}>
      {/* Header section (Company Logo) */}
      <div className="h-16 flex items-center px-4 overflow-hidden shrink-0 relative">
        {companyLogo ? (
          <div className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-lg overflow-hidden border border-sidebar-border shadow-sm bg-sidebar shrink-0 p-1">
            <img src={companyLogo} alt={companyName || 'Logo'} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
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
          <span className="font-bold text-[15px] text-sidebar-foreground leading-tight whitespace-normal line-clamp-2 break-words">
            {companyName || 'My Workspace'}
          </span>
          <button
            onClick={togglePin}
            title={isPinned ? "Desfijar sidebar" : "Fijar sidebar"}
            className="text-sidebar-foreground/60 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors p-1.5 rounded-md"
          >
            {isPinned ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Top Separator */}
      <div className="px-4 shrink-0">
        <div className="h-px w-full bg-sidebar-border rounded-full" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto py-4 px-3 space-y-4 flex flex-col custom-scrollbar">
        {authorizedNavGroups.map((group, index) => (
          <div key={group.group} className="flex flex-col space-y-0.5">
            <div className="relative flex items-center justify-center mb-0.5 min-h-[16px]">
              {/* Separador visible solo cuando está colapsado */}
              {index > 0 && (
                <div className={cn(
                  "absolute h-[2px] w-8 bg-sidebar-border rounded-full transition-all duration-300",
                  isExpanded ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100 group-hover:opacity-0 group-hover:scale-x-0"
                )} />
              )}
              {/* Texto de cabecera visible cuando está expandido */}
              <div className={cn(
                "w-full px-3 text-[10px] font-bold text-sidebar-primary tracking-wider uppercase transition-opacity duration-300 whitespace-nowrap",
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
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm border border-sidebar-border'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <div className="flex items-center justify-center min-w-[32px]">
                    <item.icon
                      className={cn(
                        'flex-shrink-0 h-[20px] w-[20px] transition-transform duration-200 group-hover/item:scale-110',
                        isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/60 group-hover/item:text-sidebar-accent-foreground'
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
          background: var(--sidebar-border); 
        }
        .group:hover .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--sidebar-ring); 
        }
      `}</style>
    </aside>
  );
};
