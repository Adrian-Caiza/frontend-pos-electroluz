import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../../shared/components/ui/input';
import { Truck, Phone, Mail, FolderTree, Tag } from 'lucide-react';
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
import { useCreateProveedor } from '../hooks/useCreateProveedor';
import { useCategorias } from '../../../categoria/presentation/hooks/useCategorias';
import { useMarcas } from '../../../marca/presentation/hooks/useMarcas';

const formSchema = z.object({
  provnombre: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'El nombre es muy largo'),
  provtelefono: z.string().regex(/^\d{10}$/, 'Debe tener exactamente 10 dígitos numéricos').nullable().optional(),
  provcorreo: z.string().email('Formato de correo inválido').or(z.literal('')).nullable().optional(),
  provctgriaid: z.string().optional().nullable(),
  provmrcid: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export interface CreateProveedorModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateProveedorModal = ({ open: controlledOpen, onOpenChange: setControlledOpen }: CreateProveedorModalProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled && setControlledOpen ? setControlledOpen : setInternalOpen;

  const { company } = useAuthStore();
  const createMutation = useCreateProveedor();
  
  const { data: categoriasData, isLoading: loadingCat } = useCategorias(1, 100);
  const { data: marcasData, isLoading: loadingMarcas } = useMarcas(1, 100);

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
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: FormValues) => {
    if (!company) return;

    createMutation.mutate({
      provemid: company.emid,
      provnombre: values.provnombre,
      provtelefono: values.provtelefono || null,
      provcorreo: values.provcorreo || null,
      provctgriaid: values.provctgriaid || null,
      provmrcid: values.provmrcid || null,
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
      confirmLabel="Registrar Proveedor"
    />
  );

  return (
    <>
      {!isControlled && (
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto font-medium">
          <Truck className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      )}

      <BaseModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        title="Registrar Proveedor"
        subtitle="Agrega un nuevo proveedor a tu catálogo."
        size="2xl"
        footer={footer}
      >
        <ModalEntityCard 
          icon={Truck}
          title="Nuevo Proveedor"
          subtitle="Información de contacto y especialidad"
        />

        <Form {...form}>
          <form id="create-proveedor-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
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
                            {categoriasData?.items.filter(cat => cat.ctgriaestado === 'activo').map(cat => (
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
                            {marcasData?.items.filter(mrc => mrc.mrcestado === 'activo').map(mrc => (
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
    </>
  );
};
