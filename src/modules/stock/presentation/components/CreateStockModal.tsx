import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../../shared/components/ui/dialog';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { useCreateStock } from '../hooks/useCreateStock';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useSucursales } from '../../../sucursal/presentation/hooks/useSucursales';
import { useProductos } from '../../../producto/presentation/hooks/useProductos';

const formSchema = z.object({
  stcksuid: z.string().min(1, 'Seleccione una sucursal'),
  stckprdtoid: z.string().min(1, 'Seleccione un producto'),
  stckcantidad: z.number().min(0, 'La cantidad no puede ser negativa'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSucursalId?: string; // Para preseleccionar si el usuario ya está viendo una sucursal
}

export const CreateStockModal = ({ open, onOpenChange, defaultSucursalId }: CreateStockModalProps) => {
  const { company } = useAuthStore();
  const { mutate: createStock, isPending } = useCreateStock();
  
  // Cargamos sucursales y productos para los selects (traemos bastantes para el dropdown)
  const { data: sucursalesData } = useSucursales(1, 100);
  const { data: productosData } = useProductos(1, 100);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stcksuid: defaultSucursalId || '',
      stckprdtoid: '',
      stckcantidad: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        stcksuid: defaultSucursalId || '',
        stckprdtoid: '',
        stckcantidad: 0,
      });
    }
  }, [open, reset, defaultSucursalId]);

  const onSubmit = (values: FormValues) => {
    if (!company?.emid) return;

    createStock(
      {
        stckemid: company.emid,
        stcksuid: values.stcksuid,
        stckprdtoid: values.stckprdtoid,
        stckcantidad: values.stckcantidad,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ingreso de Mercancía</DialogTitle>
          <DialogDescription>
            Registra un nuevo lote de producto para una sucursal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Sucursal de Destino</label>
            <select
              {...register('stcksuid')}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Seleccione una sucursal</option>
              {sucursalesData?.items.map((sucursal) => (
                <option key={sucursal.suid} value={sucursal.suid}>
                  {sucursal.sunombre} (Identificador: {sucursal.suidentificador})
                </option>
              ))}
            </select>
            {errors.stcksuid && <p className="text-sm text-red-500">{errors.stcksuid.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Producto</label>
            <select
              {...register('stckprdtoid')}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Seleccione un producto</option>
              {productosData?.items.map((producto) => (
                <option key={producto.prdtoid} value={producto.prdtoid}>
                  {producto.prdtocodigo} - {producto.prdtonombre}
                </option>
              ))}
            </select>
            {errors.stckprdtoid && <p className="text-sm text-red-500">{errors.stckprdtoid.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Cantidad Inicial</label>
            <Input 
              type="number" 
              {...register('stckcantidad', { valueAsNumber: true })} 
              placeholder="0" 
              min="0"
            />
            {errors.stckcantidad && <p className="text-sm text-red-500">{errors.stckcantidad.message}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
              {isPending ? 'Guardando...' : 'Registrar Stock'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
