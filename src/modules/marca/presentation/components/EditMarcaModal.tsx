import {  useEffect , useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../../shared/components/ui/input';
import { Tag } from 'lucide-react';
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

import { useUpdateMarca } from '../hooks/useUpdateMarca';
import type { Marca } from '../../domain/entities/Marca';

const formSchema = z.object({
  mrcnombre: z.string().max(255, 'El texto es demasiado largo').min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es muy largo'),
});

type FormValues = z.infer<typeof formSchema>;

export interface EditMarcaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marca: Marca | null;
}

export const EditMarcaModal = ({ open, onOpenChange, marca }: EditMarcaModalProps) => {
  const updateMutation = useUpdateMarca();

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
      mrcnombre: '',
    },
  });

  useEffect(() => {
    if (open && marca) {
      form.reset({
        mrcnombre: marca.mrcnombre,
      });
    }
  }, [open, marca, form]);

  const onSubmit = (values: FormValues) => {
    if (!marca) return;

    updateMutation.mutate({
      id: marca.mrcid,
      data: values,
    }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  const footer = (
    <ModalFooter 
      onCancel={handleRequestClose} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={updateMutation.isPending}
      confirmLabel="Guardar Cambios"
    />
  );

  form.formState.isDirty; 
  return (
    <>
      <BaseModal 
      isOpen={open} 
      onClose={handleRequestClose}
      title="Editar Marca"
      subtitle={`Modificando información de la marca.`}
      footer={footer}
    >
      <ModalEntityCard 
        icon={Tag}
        title={marca?.mrcnombre || 'Cargando...'}
        subtitle="Información principal de la marca"
        iconClassName="text-amber-600 bg-amber-50"
      />

      <Form {...form}>
        <form id="edit-marca-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
