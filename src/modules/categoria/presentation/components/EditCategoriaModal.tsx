import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Tags, AlignLeft, FolderTree } from 'lucide-react';
import { useUpdateCategoria } from '../hooks/useUpdateCategoria';
import type { Categoria } from '../../domain/entities/Categoria';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard,
  ModalChipGroup
} from '../../../../shared/components/ui/modal';
import { Input } from '../../../../shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../shared/components/ui/form';

const editCategoriaSchema = z.object({
  ctgnombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es muy largo'),
  ctgriadescripcion: z.string().max(200, 'La descripción es muy larga').optional(),
  ctgriaestado: z.enum(['activo', 'inactivo', 'eliminado']),
});

type EditCategoriaFormData = z.infer<typeof editCategoriaSchema>;

interface EditCategoriaModalProps {
  categoria: Categoria | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditCategoriaModal = ({ categoria, open, onOpenChange }: EditCategoriaModalProps) => {
  const { mutateAsync: updateCategoria, isPending } = useUpdateCategoria();

  const form = useForm<EditCategoriaFormData>({
    resolver: zodResolver(editCategoriaSchema),
    mode: 'onChange',
    defaultValues: {
      ctgnombre: '',
      ctgriadescripcion: '',
      ctgriaestado: 'activo',
    }
  });

  useEffect(() => {
    if (categoria && open) {
      form.reset({
        ctgnombre: categoria.ctgnombre,
        ctgriadescripcion: categoria.ctgriadescripcion || '',
        ctgriaestado: categoria.ctgriaestado,
      });
    }
  }, [categoria, open, form]);

  const onSubmit = async (data: EditCategoriaFormData) => {
    if (!categoria) return;
    
    try {
      await updateCategoria({
        id: categoria.ctgriaid,
        data: {
          ctgnombre: data.ctgnombre,
          ctgriadescripcion: data.ctgriadescripcion || undefined,
          ctgriaestado: data.ctgriaestado,
        }
      });
      onOpenChange(false);
    } catch (error: any) {
      if (error.response?.data?.message === 'Category already exists with that name') {
        form.setError('ctgnombre', { message: 'Ya existe una categoría con ese nombre' });
      } else {
        form.setError('root', { message: 'Ocurrió un error al actualizar la categoría' });
      }
    }
  };

  const footer = (
    <ModalFooter 
      onCancel={() => onOpenChange(false)} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Cambios"
    />
  );

  if (!categoria) return null;

  return (
    <BaseModal 
      isOpen={open} 
      onClose={() => onOpenChange(false)}
      title="Editar Categoría"
      subtitle="Modifica la información o el estado de la categoría."
      size="sm"
      footer={footer}
    >
      <ModalEntityCard 
        icon={FolderTree}
        title={categoria.ctgnombre}
        subtitle="Información de la categoría"
        iconClassName="text-indigo-600 bg-indigo-50"
      />

      <Form {...form}>
        <form id="edit-categoria-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <FormField
                control={form.control}
                name="ctgriaestado"
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
  );
};
