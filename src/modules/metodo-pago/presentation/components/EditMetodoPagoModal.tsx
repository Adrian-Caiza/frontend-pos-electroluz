import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, Settings2 } from 'lucide-react';
import { useUpdateMetodoPago } from '../hooks/useUpdateMetodoPago';
import type { MetodoPago } from '../../domain/MetodoPago';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../shared/components/ui/dialog';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';

const editMetodoPagoSchema = z.object({
  mpnombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es muy largo'),
  mpestado: z.enum(['activo', 'inactivo']),
});

type EditMetodoPagoFormData = z.infer<typeof editMetodoPagoSchema>;

interface EditMetodoPagoModalProps {
  metodoPago: MetodoPago | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditMetodoPagoModal = ({ metodoPago, open, onOpenChange }: EditMetodoPagoModalProps) => {
  const { mutateAsync: updateMetodoPago, isPending } = useUpdateMetodoPago();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditMetodoPagoFormData>({
    resolver: zodResolver(editMetodoPagoSchema),
    values: metodoPago ? {
      mpnombre: metodoPago.mpnombre,
      mpestado: metodoPago.mpestado,
    } : undefined,
  });

  const onSubmit = async (data: EditMetodoPagoFormData) => {
    if (!metodoPago) return;
    
    // Only send modified fields
    const payload: any = {};
    if (data.mpnombre !== metodoPago.mpnombre) payload.mpnombre = data.mpnombre;
    if (data.mpestado !== metodoPago.mpestado) payload.mpestado = data.mpestado;

    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }

    try {
      await updateMetodoPago({ id: metodoPago.mpid, data: payload });
      onOpenChange(false);
    } catch (error: any) {
      if (error.response?.data?.message === 'Playment method already exists with that name') {
        setError('mpnombre', { message: 'Ya existe otro método de pago con ese nombre' });
      } else {
        setError('root', { message: 'Ocurrió un error al actualizar el método de pago' });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings2 className="w-5 h-5 mr-2 text-indigo-600" />
            Actualizar Método de Pago
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Nombre del Método de Pago *
            </label>
            <Input
              {...register('mpnombre')}
              className={errors.mpnombre ? 'border-red-500' : ''}
            />
            {errors.mpnombre && (
              <p className="text-red-500 text-xs mt-1">{errors.mpnombre.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Estado *
            </label>
            <select
              {...register('mpestado')}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {errors.root && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
              {errors.root.message}
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
