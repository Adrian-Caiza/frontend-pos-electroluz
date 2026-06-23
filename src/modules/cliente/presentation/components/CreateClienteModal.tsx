import {  useEffect , useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, User, Mail, Phone, MapPin, Hash } from 'lucide-react';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalChipGroup,
  ModalEntityCard
} from '../../../../shared/components/ui/modal';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../shared/components/ui/form';
import { Input } from '../../../../shared/components/ui/input';

import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useCreateCliente } from '../hooks/useCreateCliente';

const formSchema = z.object({
  clntetipoidentificacion: z.enum(['cedula', 'ruc'], {
    message: 'El tipo de identificación es requerido',
  }),
  clnteidentificacion: z.string().max(255, 'El texto es demasiado largo')
    .min(1, 'La identificación es requerida')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
  clntenombre: z.string().max(255, 'El texto es demasiado largo').min(3, 'El nombre debe tener al menos 3 caracteres'),
  clntecorreo: z.string().max(255, 'El texto es demasiado largo').email('Debe ser un correo válido').min(1, 'El correo es requerido'),
  clntedireccion: z.string().max(255, 'El texto es demasiado largo').min(5, 'La dirección es muy corta'),
  clntetelefono: z.string().max(255, 'El texto es demasiado largo')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(10, 'El teléfono no puede tener más de 10 dígitos')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
}).superRefine((data, ctx) => {
  if (data.clntetipoidentificacion === 'cedula' && data.clnteidentificacion.length !== 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La cédula debe tener exactamente 10 dígitos',
      path: ['clnteidentificacion'],
    });
  } else if (data.clntetipoidentificacion === 'ruc' && data.clnteidentificacion.length !== 13) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El RUC debe tener exactamente 13 dígitos',
      path: ['clnteidentificacion'],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

interface CreateClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (cliente: any) => void;
}

export const CreateClienteModal = ({ open, onOpenChange, onSuccess }: CreateClienteModalProps) => {
  const { company } = useAuthStore();
  const { mutate: createCliente, isPending } = useCreateCliente();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRequestClose = () => {
    if (form.formState.isDirty) {
      setIsConfirmOpen(true);
    } else {
      onOpenChange(false);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      clntetipoidentificacion: 'cedula',
      clnteidentificacion: '',
      clntenombre: '',
      clntecorreo: '',
      clntedireccion: '',
      clntetelefono: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: FormValues) => {
    if (!company?.emid) return;

    createCliente(
      { ...values, clnteemid: company.emid },
      {
        onSuccess: (newCliente) => {
          onOpenChange(false);
          form.reset();
          if (onSuccess) onSuccess(newCliente);
        },
      }
    );
  };

  const footer = (
    <ModalFooter 
      onCancel={handleRequestClose} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Cliente"
    />
  );

  form.formState.isDirty; // Force tracking
  return (
    <>
      <BaseModal 
      isOpen={open} 
      onClose={handleRequestClose}
      title="Registrar Nuevo Cliente"
      subtitle="Complete los datos personales y de contacto del cliente."
      size="lg"
      footer={footer}
    >
      <ModalEntityCard 
        icon={UserPlus}
        title="Información del Cliente"
        subtitle="Los campos con asterisco (*) son obligatorios"
        iconClassName="text-indigo-600 bg-indigo-50"
      />

      <Form {...form}>
        <form id="create-cliente-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ModalSection title="Identificación">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="clntetipoidentificacion"
                render={({ field, fieldState }) => (
                  <ModalField label="Tipo de Identificación" required error={fieldState.error?.message}>
                    <FormControl>
                      <ModalChipGroup
                        options={[
                          { label: 'Cédula', value: 'cedula' },
                          { label: 'RUC', value: 'ruc' }
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="clnteidentificacion"
                render={({ field, fieldState }) => (
                  <ModalField label="Número de Identificación" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Hash} className="h-11 rounded-xl" placeholder="Ej. 1712345678" {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />
            </div>
          </ModalSection>

          <ModalSection title="Datos de Contacto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="clntenombre"
                render={({ field, fieldState }) => (
                  <div className="md:col-span-2">
                    <ModalField label="Nombre o Razón Social" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={User} className="h-11 rounded-xl" placeholder="Ej. Juan Perez" {...field} />
                      </FormControl>
                    </ModalField>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="clntecorreo"
                render={({ field, fieldState }) => (
                  <ModalField label="Correo Electrónico" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Mail} className="h-11 rounded-xl" type="email" placeholder="cliente@correo.com" {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="clntetelefono"
                render={({ field, fieldState }) => (
                  <ModalField label="Teléfono" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Phone} className="h-11 rounded-xl" placeholder="Ej. 0987654321" {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="clntedireccion"
                render={({ field, fieldState }) => (
                  <div className="md:col-span-2">
                    <ModalField label="Dirección" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={MapPin} className="h-11 rounded-xl" placeholder="Ej. Av. Principal y Calle 10" {...field} />
                      </FormControl>
                    </ModalField>
                  </div>
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
