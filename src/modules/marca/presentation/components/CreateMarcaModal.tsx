import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Tag, Plus } from 'lucide-react';
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
import { useCreateMarca } from '../hooks/useCreateMarca';

const formSchema = z.object({
  mrcnombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es muy largo'),
});

type FormValues = z.infer<typeof formSchema>;

export interface CreateMarcaModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateMarcaModal = ({ open: controlledOpen, onOpenChange: setControlledOpen }: CreateMarcaModalProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled && setControlledOpen ? setControlledOpen : setInternalOpen;

  const { company } = useAuthStore();
  const createMutation = useCreateMarca();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      mrcnombre: '',
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
      mrcemid: company.emid,
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
      confirmLabel="Crear Marca"
    />
  );

  return (
    <>
      {!isControlled && (
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Marca
        </Button>
      )}

      <BaseModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        title="Crear Nueva Marca"
        subtitle="Complete la información para registrar una nueva marca en el sistema."
        footer={footer}
      >
        <ModalEntityCard 
          icon={Tag}
          title="Detalles de la Marca"
          subtitle="Información principal"
        />

        <Form {...form}>
          <form id="create-marca-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ModalSection title="Información Principal">
              <FormField
                control={form.control}
                name="mrcnombre"
                render={({ field, fieldState }) => (
                  <ModalField label="Nombre" required error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          {...field} 
                          className="pl-10 h-11"
                          placeholder="Ej: Truper, Stanley..." 
                        />
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />
            </ModalSection>
          </form>
        </Form>
      </BaseModal>
    </>
  );
};
