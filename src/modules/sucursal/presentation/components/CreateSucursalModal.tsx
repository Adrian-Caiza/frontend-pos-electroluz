import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useCreateSucursal } from '../hooks/useCreateSucursal';
import { Button } from '../../../../shared/components/ui/button';
import { Building2, Hash, MapPin, Mail, Store } from 'lucide-react';
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
  sunombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  suidentificador: z.string().length(3, 'El identificador debe tener exactamente 3 dígitos').regex(/^\d+$/, 'Solo se permiten números'),
  sudireccion: z.string().optional(),
  sucorreo: z.string().email('Debe ser un correo válido').or(z.literal('')).optional(),
});

export const CreateSucursalModal = () => {
  const [open, setOpen] = useState(false);
  const { company } = useAuthStore();
  const { mutate: createSucursal, isPending } = useCreateSucursal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      sunombre: '',
      suidentificador: '',
      sudireccion: '',
      sucorreo: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!company) return;
    
    // Clean up empty strings to undefined to match optional backend rules if needed
    const payload = {
      suemid: company.emid,
      sunombre: values.sunombre,
      suidentificador: values.suidentificador,
      sudireccion: values.sudireccion || undefined,
      sucorreo: values.sucorreo || undefined,
    };

    createSucursal(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const footer = (
    <ModalFooter 
      onCancel={() => handleOpenChange(false)} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Sucursal"
    />
  );

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Store className="w-4 h-4 mr-2" /> Nueva Sucursal
      </Button>

      <BaseModal 
        isOpen={open} 
        onClose={() => handleOpenChange(false)}
        title="Registrar Nueva Sucursal"
        subtitle="Añade una nueva sucursal a tu empresa. El identificador debe ser único."
        size="md"
        footer={footer}
      >
        <ModalEntityCard 
          icon={Building2}
          title="Nueva Sucursal"
          subtitle="Comience a operar en una nueva ubicación"
        />
        
        <Form {...form}>
          <form id="create-sucursal-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
    </>
  );
};
