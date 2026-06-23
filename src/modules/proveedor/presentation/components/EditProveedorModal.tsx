import {  useEffect , useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../../shared/components/ui/input';
import { Truck, Phone, Mail, FolderTree, Tag } from 'lucide-react';
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

import { useUpdateProveedor } from '../hooks/useUpdateProveedor';
import { useCategorias } from '../../../categoria/presentation/hooks/useCategorias';
import { useMarcas } from '../../../marca/presentation/hooks/useMarcas';
import type { Proveedor } from '../../domain/entities/Proveedor';

const formSchema = z.object({
  provnombre: z.string().max(255, 'El texto es demasiado largo').min(3, 'Mínimo 3 caracteres').max(100, 'El nombre es muy largo'),
  provtelefono: z.string().max(255, 'El texto es demasiado largo').regex(/^\d{10}$/, 'Debe tener exactamente 10 dígitos numéricos'),
  provcorreo: z.string().max(255, 'El texto es demasiado largo').email('Formato de correo inválido').or(z.literal('')).nullable().optional(),
  provctgriaid: z.string().max(255, 'El texto es demasiado largo').optional().nullable(),
  provmrcid: z.string().max(255, 'El texto es demasiado largo').optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export interface EditProveedorModalProps {
  proveedor: Proveedor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProveedorModal = ({ proveedor, open, onOpenChange }: EditProveedorModalProps) => {
  const updateMutation = useUpdateProveedor();
  
  const { data: categoriasData, isLoading: loadingCat } = useCategorias(1, 100);
  const { data: marcasData, isLoading: loadingMarcas } = useMarcas(1, 100);

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
      provnombre: '',
      provtelefono: '',
      provcorreo: '',
      provctgriaid: '',
      provmrcid: '',
    },
  });

  useEffect(() => {
    if (open && proveedor) {
      form.reset({
        provnombre: proveedor.provnombre,
        provtelefono: proveedor.provtelefono || '',
        provcorreo: proveedor.provcorreo || '',
        provctgriaid: proveedor.categoria?.ctgriaid || '',
        provmrcid: proveedor.marca?.mrcid || '',
      });
    }
  }, [open, proveedor, form]);

  const onSubmit = (values: FormValues) => {
    if (!proveedor) return;

    updateMutation.mutate({
      id: proveedor.provid,
      data: {
        provnombre: values.provnombre,
        provtelefono: values.provtelefono ? values.provtelefono : undefined,
        provcorreo: values.provcorreo ? values.provcorreo : undefined,
        provctgriaid: values.provctgriaid ? values.provctgriaid : undefined,
        provmrcid: values.provmrcid ? values.provmrcid : undefined,
      },
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

  form.formState.isDirty; // Force tracking
  return (
    <>
      <BaseModal 
      isOpen={open} 
      onClose={handleRequestClose}
      title="Editar Proveedor"
      subtitle="Modifique los datos del proveedor."
      size="2xl"
      footer={footer}
    >
      <ModalEntityCard 
        icon={Truck}
        title={proveedor?.provnombre || 'Cargando...'}
        subtitle="Edición de información"
      />

      <Form {...form}>
        <form id="edit-proveedor-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ModalSection title="Detalles Principales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="provnombre"
                render={({ field, fieldState }) => (
                  <ModalField label="Nombre del Proveedor" required error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="Ej: Distribuidora XYZ"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="provtelefono"
                render={({ field, fieldState }) => (
                  <ModalField label="Teléfono" required error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          value={field.value || ''}
                          placeholder="Ej: 0984653471"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="provcorreo"
                render={({ field, fieldState }) => (
                  <ModalField label="Correo (Opcional)" error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          value={field.value || ''}
                          placeholder="Ej: contacto@proveedor.com"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />
            </div>
          </ModalSection>

          <ModalSection title="Especialidad (Opcional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="provctgriaid"
                render={({ field, fieldState }) => (
                  <ModalField label="Categoría" error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <FolderTree className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          {...field}
                          value={field.value || ''}
                          disabled={loadingCat}
                          className="flex h-11 w-full rounded-xl border border-border bg-transparent dark:bg-slate-900 text-foreground pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Ninguna</option>
                          {categoriasData?.items.filter(cat => cat.ctgriaestado === 'activo' || cat.ctgriaid === proveedor?.categoria?.ctgriaid).map(cat => (
                            <option key={cat.ctgriaid} value={cat.ctgriaid}>{cat.ctgnombre}</option>
                          ))}
                        </select>
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="provmrcid"
                render={({ field, fieldState }) => (
                  <ModalField label="Marca" error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          {...field}
                          value={field.value || ''}
                          disabled={loadingMarcas}
                          className="flex h-11 w-full rounded-xl border border-border bg-transparent dark:bg-slate-900 text-foreground pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Ninguna</option>
                          {marcasData?.items.filter(mrc => mrc.mrcestado === 'activo' || mrc.mrcid === proveedor?.marca?.mrcid).map(mrc => (
                            <option key={mrc.mrcid} value={mrc.mrcid}>{mrc.mrcnombre}</option>
                          ))}
                        </select>
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
