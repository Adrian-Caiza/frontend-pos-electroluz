import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateSucursal } from '../hooks/useUpdateSucursal';
import type { Sucursal } from '../../domain/entities/Sucursal';
import { Building2, Hash, MapPin, Mail } from 'lucide-react';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard
} from '../../../../shared/components/ui/modal';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../shared/components/ui/form';
import { Input } from '../../../../shared/components/ui/input';

const formSchema = z.object({
  sunombre: z.string().max(255, 'El texto es demasiado largo').min(3, 'El nombre debe tener al menos 3 caracteres').optional().or(z.literal('')),
  suidentificador: z.string().length(3, 'El identificador debe tener exactamente 3 dígitos').regex(/^\d+$/, 'Solo se permiten números').optional().or(z.literal('')),
  sudireccion: z.string().max(255, 'El texto es demasiado largo').optional(),
  sucorreo: z.string().max(255, 'El texto es demasiado largo').email('Debe ser un correo válido').or(z.literal('')).optional(),
});

interface EditSucursalModalProps {
  sucursal: Sucursal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditSucursalModal = ({ sucursal, open, onOpenChange }: EditSucursalModalProps) => {
  const { mutate: updateSucursal, isPending } = useUpdateSucursal();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRequestClose = () => {
    if (form.formState.isDirty) {
      setIsConfirmOpen(true);
    } else {
      onOpenChange(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      sunombre: sucursal.sunombre,
      suidentificador: sucursal.suidentificador,
      sudireccion: sucursal.sudireccion || '',
      sucorreo: sucursal.sucorreo || '',
    },
  });

  // Actualizar valores del formulario si la sucursal seleccionada cambia
  useEffect(() => {
    form.reset({
      sunombre: sucursal.sunombre,
      suidentificador: sucursal.suidentificador,
      sudireccion: sucursal.sudireccion || '',
      sucorreo: sucursal.sucorreo || '',
    });
  }, [sucursal, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      sunombre: values.sunombre || undefined,
      suidentificador: values.suidentificador || undefined,
      sudireccion: values.sudireccion || undefined,
      sucorreo: values.sucorreo || undefined,
    };

    updateSucursal(
      { id: sucursal.suid, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const footer = (
    <ModalFooter 
      onCancel={handleRequestClose} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Cambios"
    />
  );

  form.formState.isDirty; // Force tracking
  return (
    <>
      <BaseModal 
      isOpen={open} 
      onClose={handleRequestClose}
      title="Editar Sucursal"
      subtitle="Modifica la información y detalles de la sucursal."
      size="md"
      footer={footer}
    >
      <ModalEntityCard 
        icon={Building2}
        title={sucursal?.sunombre || 'Cargando...'}
        subtitle={`ID: ${sucursal?.suidentificador || ''}`}
        iconClassName="text-indigo-600 bg-indigo-50"
      />

      <Form {...form}>
        <form id="edit-sucursal-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ModalSection title="Información Básica">
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="sunombre"
                render={({ field, fieldState }) => (
                  <ModalField label="Nombre de la Sucursal" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Building2} className="h-11 rounded-xl" placeholder="Ej: Sucursal Centro" {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="suidentificador"
                render={({ field, fieldState }) => (
                  <ModalField label="Identificador (Ej: 001)" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Hash} className="h-11 rounded-xl" placeholder="001" maxLength={3} {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />
            </div>
          </ModalSection>

          <ModalSection title="Datos de Contacto (Opcional)">
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="sudireccion"
                render={({ field, fieldState }) => (
                  <ModalField label="Dirección" error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={MapPin} className="h-11 rounded-xl" placeholder="Av. Principal 123..." {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="sucorreo"
                render={({ field, fieldState }) => (
                  <ModalField label="Correo Electrónico" error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Mail} className="h-11 rounded-xl" placeholder="sucursal@empresa.com" type="email" {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />
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
