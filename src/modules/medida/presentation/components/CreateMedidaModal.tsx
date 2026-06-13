import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../../shared/components/ui/input';
import { Scale, Type } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
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

import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useCreateMedida } from '../hooks/useCreateMedida';

const formSchema = z.object({
  mdianombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es muy largo'),
  mdiaabreviatura: z.string().min(1, 'La abreviatura es requerida').max(10, 'Máximo 10 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

export interface CreateMedidaModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateMedidaModal = ({ open: controlledOpen, onOpenChange: setControlledOpen }: CreateMedidaModalProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled && setControlledOpen ? setControlledOpen : setInternalOpen;

  const { company } = useAuthStore();
  const createMutation = useCreateMedida();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      mdianombre: '',
      mdiaabreviatura: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: FormValues) => {
    if (!company) return;

    createMutation.mutate({
      ...values,
      mdiaemid: company.emid,
    }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  const footer = (
    <ModalFooter 
      onCancel={() => setOpen(false)} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={createMutation.isPending}
      confirmLabel="Registrar Medida"
    />
  );

  return (
    <>
      {!isControlled && (
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto font-medium">
          <Scale className="w-4 h-4 mr-2" />
          Nueva Medida
        </Button>
      )}

      <BaseModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        title="Registrar Medida"
        subtitle="Agrega una nueva unidad de medida a tu catálogo."
        size="md"
        footer={footer}
      >
        <ModalEntityCard 
          icon={Scale}
          title="Nueva Medida"
          subtitle="Define el nombre y su abreviatura correspondiente"
        />

        <Form {...form}>
          <form id="create-medida-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
    </>
  );
};
