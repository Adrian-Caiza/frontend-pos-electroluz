import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, Settings2 } from 'lucide-react';
import { useUpdateMetodoPago } from '../hooks/useUpdateMetodoPago';
import type { MetodoPago } from '../../domain/MetodoPago';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard,
  ModalChipGroup
} from '../../../../shared/components/ui/modal';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../shared/components/ui/form';

const editMetodoPagoSchema = z.object({
  mpnombre: z.string().max(255, 'El texto es demasiado largo').min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es muy largo'),
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

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRequestClose = () => {
    if (form.formState.isDirty) {
      setIsConfirmOpen(true);
    } else {
      onOpenChange(false);
    }
  };

  const form = useForm<EditMetodoPagoFormData>({
    resolver: zodResolver(editMetodoPagoSchema),
    mode: 'onChange',
    values: metodoPago ? {
      mpnombre: metodoPago.mpnombre,
      mpestado: metodoPago.mpestado,
    } : undefined,
  });

  const onSubmit = async (data: EditMetodoPagoFormData) => {
    if (!metodoPago) return;
    
    
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
        form.setError('mpnombre', { message: 'Ya existe otro método de pago con ese nombre' });
      } else {
        form.setError('root', { message: 'Ocurrió un error al actualizar el método de pago' });
      }
    }
  };

  const footer = (
    <ModalFooter 
      onCancel={handleRequestClose} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Cambios"
    />
  );

  form.formState.isDirty; 
  return (
    <>
      <BaseModal 
      isOpen={open} 
      onClose={handleRequestClose}
      title="Editar Método de Pago"
      subtitle={`Modificando el método de pago: ${metodoPago?.mpnombre || ''}.`}
      size="sm"
      footer={footer}
    >
      <ModalEntityCard 
        icon={Settings2}
        title={metodoPago?.mpnombre || 'Cargando...'}
        subtitle={`Estado actual: ${metodoPago?.mpestado || ''}`}
        iconClassName="text-amber-600 bg-amber-50"
      />

      <Form {...form}>
        <form id="edit-metodo-pago-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ModalSection title="Detalles y Estado">
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
                        {...field} 
                      />
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="mpestado"
                render={({ field, fieldState }) => (
                  <ModalField label="Estado" required error={fieldState.error?.message}>
                    <FormControl>
                      <ModalChipGroup
                        options={[
                          { label: 'Activo', value: 'activo' },
                          { label: 'Inactivo', value: 'inactivo' }
                        ]}
                        value={field.value}
                        onChange={field.onChange}
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

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          onOpenChange(false);
        }}
        title="¿Descartar cambios?"
        description="¿Estás seguro de que deseas salir? Perderás todos los cambios no guardados."
        confirmText="Descartar"
        cancelText="Continuar editando"
        variant="warning"
      />
    </>
  );
};
