import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function CajaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Punto de Venta (Caja)</h1>
          <p className="text-slate-500 mt-2">
            Inicia o continúa con el registro de ventas.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Nueva Venta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Caja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-slate-500 border-2 border-dashed rounded-lg border-slate-200">
            Aún no has abierto la caja hoy. Haz clic en "Nueva Venta" o "Abrir Caja" para empezar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
