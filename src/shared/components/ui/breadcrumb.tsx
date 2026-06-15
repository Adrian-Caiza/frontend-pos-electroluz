import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useMemo } from 'react';

const routeNames: Record<string, string> = {
  'dashboard': 'Dashboard',
  'terminal': 'Terminal POS',
  'proformas': 'Historial Ventas',
  'caja': 'Caja',
  'clientes': 'Clientes',
  'productos': 'Productos',
  'categorias': 'Categorías',
  'marcas': 'Marcas',
  'medidas': 'Medidas',
  'proveedores': 'Proveedores',
  'stock': 'Inventario',
  'usuarios': 'Personal',
  'sucursales': 'Sucursales',
  'metodos-pago': 'Métodos de Pago',
};

export function Breadcrumbs() {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split('/').filter(p => p);
    
    const crumbs = [];
    let currentPath = '';
    
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      currentPath += `/${path}`;
      
      let name = routeNames[path];
      
      if (!name) {
         if (path.length > 20) {
             name = 'Detalle';
         } else {
             name = decodeURIComponent(path).charAt(0).toUpperCase() + decodeURIComponent(path).slice(1);
         }
      }
      
      crumbs.push({
        name,
        path: currentPath,
        isLast: i === paths.length - 1
      });
    }
    
    return crumbs;
  }, [location.pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center ml-4">
      <ol className="flex items-center space-x-1.5 text-[14px] text-muted-foreground">
        <li>
          <Link 
            to="/dashboard" 
            className="flex items-center p-1 rounded-md hover:bg-muted hover:text-foreground transition-all duration-200"
            title="Dashboard"
            aria-label="Ir al inicio"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        
        {breadcrumbs.map((crumb) => {
          // Si estamos en dashboard, ya mostramos la casa, no duplicar
          if (crumb.path === '/dashboard') return null;

          return (
            <li key={crumb.path} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              {crumb.isLast ? (
                <span className="font-semibold text-foreground tracking-tight px-1" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link 
                  to={crumb.path}
                  className="px-1 py-0.5 rounded-md hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
