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
import { useUpdateStock } from '../hooks/useUpdateStock';
import type { Stock } from '../../domain/entities/Stock';

const formSchema = z.object({
  stckcantidad: z.number().min(0, 'La cantidad no puede ser negativa'),
  stckestado: z.enum(['activo', 'inactivo', 'eliminado']),
});

type FormValues = z.infer<typeof formSchema>;

interface EditStockModalProps {
  stock: Stock;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditStockModal = ({ stock, open, onOpenChange }: EditStockModalProps) => {
  const { mutate: updateStock, isPending } = useUpdateStock();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stckcantidad: Number(stock.stckcantidad) || 0,
      stckestado: stock.stckestado,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        stckcantidad: Number(stock.stckcantidad) || 0,
        stckestado: stock.stckestado,
      });
    }
  }, [open, reset, stock]);

  const onSubmit = (values: FormValues) => {
    const payload: any = { stcksuid: stock.sucursal.suid }; // Obligatorio para API

    // Solo enviamos lo que cambió para evitar conflictos
    if (values.stckcantidad !== Number(stock.stckcantidad)) {
      payload.stckcantidad = values.stckcantidad;
    }
    if (values.stckestado !== stock.stckestado) {
      payload.stckestado = values.stckestado;
    }

    // Si no hay cambios, cerramos
    if (Object.keys(payload).length === 1) { // Solo tiene stcksuid
      onOpenChange(false);
      return;
    }

    updateStock(
      { id: stock.stckid, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajuste de Bodega</DialogTitle>
          <DialogDescription>
            Modifica la cantidad o estado del producto <b>{stock.producto.prdtonombre}</b> en la <b>{stock.sucursal.sunombre}</b>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nueva Cantidad</label>
            <Input 
              type="number" 
              {...register('stckcantidad', { valueAsNumber: true })} 
              min="0"
              step="0.01"
            />
            {errors.stckcantidad && <p className="text-sm text-red-500">{errors.stckcantidad.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Estado del Lote</label>
            <select
              {...register('stckestado')}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            {errors.stckestado && <p className="text-sm text-red-500">{errors.stckestado.message}</p>}
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
              {isPending ? 'Guardando...' : 'Guardar Ajuste'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
