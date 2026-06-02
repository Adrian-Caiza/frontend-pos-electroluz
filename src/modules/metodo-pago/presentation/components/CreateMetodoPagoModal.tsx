import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { WalletCards, Type, Hash, Plus, Wallet } from 'lucide-react';
import { useCreateMetodoPago } from '../hooks/useCreateMetodoPago';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard
} from '../../../../shared/components/ui/modal';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../shared/components/ui/form';

const createMetodoPagoSchema = z.object({
  mpnombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es muy largo'),
});

type CreateMetodoPagoFormData = z.infer<typeof createMetodoPagoSchema>;

export const CreateMetodoPagoModal = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { mutateAsync: createMetodoPago, isPending } = useCreateMetodoPago();

  const form = useForm<CreateMetodoPagoFormData>({
    resolver: zodResolver(createMetodoPagoSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: CreateMetodoPagoFormData) => {
    if (!user?.usemid) return;
    
    try {
      await createMetodoPago({
        mpemid: user.usemid,
        mpnombre: data.mpnombre,
      });
      form.reset();
      setOpen(false);
    } catch (error: any) {
      if (error.response?.data?.message === 'Playment method already exists with that name') {
        form.setError('mpnombre', { message: 'Ya existe un método de pago con ese nombre' });
      } else {
        form.setError('root', { message: 'Ocurrió un error al crear el método de pago' });
      }
    }
  };

  const footer = (
    <ModalFooter 
      onCancel={() => {
        setOpen(false);
        form.reset();
      }} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Método"
    />
  );

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
        <WalletCards className="w-4 h-4 mr-2" />
        Nuevo Método de Pago
      </Button>

      <BaseModal 
        isOpen={open} 
        onClose={() => {
          setOpen(false);
          form.reset();
        }}
        title="Registrar Método de Pago"
        subtitle="Añade un nuevo método de pago para ser usado en las transacciones."
        size="sm"
        footer={footer}
      >
        <ModalEntityCard 
          icon={Wallet}
          title="Nuevo Método"
          subtitle="Información del método de pago"
        />

        <Form {...form}>
          <form id="create-metodo-pago-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ModalSection title="Detalles">
              <div className="grid grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="mpnombre"
                  render={({ field, fieldState }) => (
                    <ModalField label="Nombre del Método de Pago" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input 
                          icon={Wallet} 
                          className="h-11 rounded-xl" 
                          placeholder="Ej: Efectivo, Tarjeta de Crédito" 
                          {...field} 
                        />
                      </FormControl>
                    </ModalField>
                  )}
                />

                {form.formState.errors.root && (
                  <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md border border-red-100">
                    {form.formState.errors.root.message}
                  </p>
                )}
              </div>
            </ModalSection>
          </form>
        </Form>
      </BaseModal>
    </>
  );
};
