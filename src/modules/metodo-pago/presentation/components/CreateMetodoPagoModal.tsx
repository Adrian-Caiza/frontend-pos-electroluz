import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Wallet, Plus } from 'lucide-react';
import { useCreateMetodoPago } from '../hooks/useCreateMetodoPago';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../shared/components/ui/dialog';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';

const createMetodoPagoSchema = z.object({
  mpnombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es muy largo'),
});

type CreateMetodoPagoFormData = z.infer<typeof createMetodoPagoSchema>;

export const CreateMetodoPagoModal = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { mutateAsync: createMetodoPago, isPending } = useCreateMetodoPago();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateMetodoPagoFormData>({
    resolver: zodResolver(createMetodoPagoSchema),
  });

  const onSubmit = async (data: CreateMetodoPagoFormData) => {
    if (!user?.usemid) return;
    
    try {
      await createMetodoPago({
        mpemid: user.usemid,
        mpnombre: data.mpnombre,
      });
      reset();
      setOpen(false);
    } catch (error: any) {
      if (error.response?.data?.message === 'Playment method already exists with that name') {
        setError('mpnombre', { message: 'Ya existe un método de pago con ese nombre' });
      } else {
        setError('root', { message: 'Ocurrió un error al crear el método de pago' });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Método de Pago
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-indigo-600" />
            Registrar Método de Pago
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Nombre del Método de Pago *
            </label>
            <Input
              {...register('mpnombre')}
              placeholder="Ej: Efectivo, Tarjeta de Crédito, Transferencia"
              className={errors.mpnombre ? 'border-red-500' : ''}
            />
            {errors.mpnombre && (
              <p className="text-red-500 text-xs mt-1">{errors.mpnombre.message}</p>
            )}
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
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isPending ? 'Guardando...' : 'Guardar Método'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
