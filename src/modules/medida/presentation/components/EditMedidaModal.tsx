import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../../shared/components/ui/input';
import { Scale, Type } from 'lucide-react';
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

import { useUpdateMedida } from '../hooks/useUpdateMedida';
import type { Medida } from '../../domain/entities/Medida';

const formSchema = z.object({
  mdianombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es muy largo'),
  mdiaabreviatura: z.string().min(1, 'La abreviatura es requerida').max(10, 'Máximo 10 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

export interface EditMedidaModalProps {
  medida: Medida | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditMedidaModal = ({ medida, open, onOpenChange }: EditMedidaModalProps) => {
  const updateMutation = useUpdateMedida();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      mdianombre: '',
      mdiaabreviatura: '',
    },
  });

  useEffect(() => {
    if (open && medida) {
      form.reset({
        mdianombre: medida.mdianombre,
        mdiaabreviatura: medida.mdiaabreviatura,
      });
    }
  }, [open, medida, form]);

  const onSubmit = (values: FormValues) => {
    if (!medida) return;

    updateMutation.mutate({
      id: medida.mdiaid,
      data: values,
    }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  const footer = (
    <ModalFooter 
      onCancel={() => onOpenChange(false)} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={updateMutation.isPending}
      confirmLabel="Guardar Cambios"
    />
  );

  return (
    <BaseModal 
      isOpen={open} 
      onClose={() => onOpenChange(false)}
      title="Editar Medida"
      subtitle="Modifique los datos de la unidad de medida."
      size="md"
      footer={footer}
    >
      <ModalEntityCard 
        icon={Scale}
        title={medida?.mdianombre || 'Cargando...'}
        subtitle="Edición de información"
      />

      <Form {...form}>
        <form id="edit-medida-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ModalSection title="Detalles">
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="mdianombre"
                render={({ field, fieldState }) => (
                  <ModalField label="Nombre de la Medida" required error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="Ej: Kilogramos, Metros..."
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="mdiaabreviatura"
                render={({ field, fieldState }) => (
                  <ModalField label="Abreviatura" required error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="Ej: KG, M, UND"
                          className="pl-10 uppercase"
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />
            </div>
          </ModalSection>
        </form>
      </Form>
    </BaseModal>
  );
};
