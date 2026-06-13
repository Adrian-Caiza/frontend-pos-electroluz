import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Tags, AlignLeft, Plus, FolderTree } from 'lucide-react';
import { useCreateCategoria } from '../hooks/useCreateCategoria';
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

const createCategoriaSchema = z.object({
  ctgnombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es muy largo'),
  ctgriadescripcion: z.string().max(200, 'La descripción es muy larga').optional(),
});

type CreateCategoriaFormData = z.infer<typeof createCategoriaSchema>;

export const CreateCategoriaModal = () => {
  const [open, setOpen] = useState(false);
  const { company } = useAuthStore();
  const { mutateAsync: createCategoria, isPending } = useCreateCategoria();

  const form = useForm<CreateCategoriaFormData>({
    resolver: zodResolver(createCategoriaSchema),
    mode: 'onChange',
    defaultValues: {
      ctgnombre: '',
      ctgriadescripcion: '',
    }
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (data: CreateCategoriaFormData) => {
    if (!company?.emid) return;
    
    try {
      await createCategoria({
        ctgriaemid: company.emid,
        ctgnombre: data.ctgnombre,
        ctgriadescripcion: data.ctgriadescripcion || undefined,
      });
      setOpen(false);
    } catch (error: any) {
      if (error.response?.data?.message === 'Category already exists with that name') {
        form.setError('ctgnombre', { message: 'Ya existe una categoría con ese nombre' });
      } else {
        form.setError('root', { message: 'Ocurrió un error al crear la categoría' });
      }
    }
  };

  const footer = (
    <ModalFooter 
      onCancel={() => setOpen(false)} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Categoría"
    />
  );

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Tags className="w-4 h-4 mr-2" />
        Nueva Categoría
      </Button>

      <BaseModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        title="Registrar Categoría"
        subtitle="Añade una nueva categoría para organizar tus productos."
        size="sm"
        footer={footer}
      >
        <ModalEntityCard 
          icon={FolderTree}
          title="Nueva Categoría"
          subtitle="Información de la categoría"
        />

        <Form {...form}>
          <form id="create-categoria-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ModalSection title="Detalles">
              <div className="grid grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="ctgnombre"
                  render={({ field, fieldState }) => (
                    <ModalField label="Nombre de la Categoría" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input 
                          icon={Tags} 
                          className="h-11 rounded-xl" 
                          placeholder="Ej: Herramientas, Construcción" 
                          {...field} 
                        />
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctgriadescripcion"
                  render={({ field, fieldState }) => (
                    <ModalField label="Descripción (Opcional)" error={fieldState.error?.message}>
                      <FormControl>
                        <Input 
                          icon={AlignLeft} 
                          className="h-11 rounded-xl" 
                          placeholder="Ej: Productos para construcción" 
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
