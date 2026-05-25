import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  ShoppingBag,
  Store,
  Users,
  Settings,
  PackageSearch,
  ShoppingCart
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const MainLayout = () => {
  const { user, company, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['jefe'] },
    { name: 'Caja', path: '/caja', icon: ShoppingCart, roles: ['jefe', 'cajero'] },
    { name: 'Productos', path: '/productos', icon: PackageSearch, roles: ['jefe'] },
    { name: 'Inventario', path: '/inventario', icon: Store, roles: ['jefe'] },
    { name: 'Usuarios', path: '/usuarios', icon: Users, roles: ['jefe'] },
  ];

  const authorizedNavItems = navItems.filter((item) =>
    item.roles.includes(user?.usrol || '')
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <ShoppingBag className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="font-bold text-lg text-slate-800 truncate">
            {company?.emrznsocial || 'POS App'}
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {authorizedNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive ? 'text-indigo-700' : 'text-slate-400'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center md:hidden">
            <span className="font-bold text-lg text-slate-800">
              {company?.emrznsocial || 'POS App'}
            </span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 flex items-center space-x-2 pl-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.usapodo || 'Usuario'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.usnombre}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.uscorreo}
                    </p>
                    <p className="text-xs leading-none text-indigo-600 font-semibold mt-1">
                      Rol: {user?.usrol}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
