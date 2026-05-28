import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, PenTool } from 'lucide-react';
import { useTerminalCart } from '../../hooks/useTerminalCart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../../shared/components/ui/dialog';
import { Button } from '../../../../../shared/components/ui/button';
import { Input } from '../../../../../shared/components/ui/input';
import { useState } from 'react';

const manualItemSchema = z.object({
  descripcion: z.string().min(2, 'La descripción debe tener al menos 2 caracteres'),
  cantidad: z.number().min(1, 'La cantidad mínima es 1'),
  precioUnitario: z.number().min(0.01, 'El precio debe ser mayor a 0'),
});

type ManualItemFormData = z.infer<typeof manualItemSchema>;

export const ManualItemModal = () => {
  const [open, setOpen] = useState(false);
  const addItem = useTerminalCart(state => state.addItem);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualItemFormData>({
    resolver: zodResolver(manualItemSchema),
    defaultValues: {
      cantidad: 1,
      precioUnitario: 0,
    }
  });

  const onSubmit = (data: ManualItemFormData) => {
    addItem({
      id: crypto.randomUUID(), // Local unique ID
      esInventariable: false,
      codigo: undefined, // Manual items don't have a code usually
      descripcion: data.descripcion,
      cantidad: data.cantidad,
      precioUnitario: data.precioUnitario,
    });
    
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
          <PenTool className="w-4 h-4 mr-2" />
          Servicio Manual
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PenTool className="w-5 h-5 mr-2 text-indigo-600" />
            Agregar Servicio o Ítem Manual
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Descripción *
            </label>
            <Input
              {...register('descripcion')}
              placeholder="Ej: Flete, Instalación, Mano de obra"
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Cantidad *
              </label>
              <Input
                type="number"
                {...register('cantidad', { valueAsNumber: true })}
                className={errors.cantidad ? 'border-red-500' : ''}
              />
              {errors.cantidad && (
                <p className="text-red-500 text-xs mt-1">{errors.cantidad.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Precio Unitario ($) *
              </label>
              <Input
                type="number"
                step="0.01"
                {...register('precioUnitario', { valueAsNumber: true })}
                className={errors.precioUnitario ? 'border-red-500' : ''}
              />
              {errors.precioUnitario && (
                <p className="text-red-500 text-xs mt-1">{errors.precioUnitario.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Agregar al Carrito
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
