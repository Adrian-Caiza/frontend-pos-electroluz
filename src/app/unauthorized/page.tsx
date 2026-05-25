import { Link } from 'react-router-dom';
import { Button } from '../../shared/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Acceso Denegado</h1>
          <p className="text-slate-500 mt-2">
            No tienes los permisos necesarios para ver esta página o módulo.
          </p>
        </div>
        <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
