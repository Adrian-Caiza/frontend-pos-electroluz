import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useCreateCheckout } from '../hooks/useCreateCheckout';
import { useSucursales } from '../../../sucursal/presentation/hooks/useSucursales';
import { Button } from '../../../../shared/components/ui/button';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard
} from '../../../../shared/components/ui/modal';
import {
  Dialog,
} from '../../../../shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../shared/components/ui/form';
import { Input } from '../../../../shared/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';
import { Store, Hash, MonitorSmartphone, Plus, Building2, Fingerprint } from 'lucide-react';
import { PhCashRegisterFill } from '../../../../shared/components/icons/icons';

const formSchema = z.object({
  cjidentificador: z.string().length(3, 'El identificador debe tener exactamente 3 dígitos').regex(/^\d+$/, 'Solo se permiten números'),
  cjsuid: z.string().max(255, 'El texto es demasiado largo').min(1, 'Debe seleccionar una sucursal'),
});

export const CreateCheckoutModal = () => {
  const [open, setOpen] = useState(false);
  const { company } = useAuthStore();
  const { mutate: createCheckout, isPending } = useCreateCheckout();
  
  const { data: sucursalesData, isLoading: loadingSucursales } = useSucursales(1, 100);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRequestClose = () => {
    if (form.formState.isDirty) {
      setIsConfirmOpen(true);
    } else {
      handleOpenChange(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      cjidentificador: '',
      cjsuid: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!company) return;
    createCheckout(
      {
        cjemid: company.emid,
        cjsuid: values.cjsuid,
        cjidentificador: values.cjidentificador,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) form.reset();
  };

  const footer = (
    <ModalFooter 
      onCancel={handleRequestClose} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Caja"
    />
  );

  form.formState.isDirty; 
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PhCashRegisterFill className="w-5 h-5 mr-2" /> Nueva Caja
      </Button>

      <BaseModal 
        isOpen={open} 
        onClose={handleRequestClose}
        title="Registrar Nueva Caja"
        subtitle="Crea una caja asignándole un identificador de 3 dígitos y vinculándola a una sucursal."
        size="md"
        footer={footer}
      >
        <ModalEntityCard 
          icon={MonitorSmartphone}
          title="Nueva Caja/Terminal"
          subtitle="Configure los datos de la nueva caja"
        />

        <Form {...form}>
          <form id="create-checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ModalSection title="Asignación y Detalles">
              <div className="grid grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="cjsuid"
                  render={({ field, fieldState }) => (
                    <ModalField label="Sucursal" required error={fieldState.error?.message}>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-11 rounded-xl pl-10 border-slate-300">
                              <SelectValue placeholder={loadingSucursales ? "Cargando sucursales..." : "Seleccione una sucursal"} />
                            </SelectTrigger>
                            <SelectContent>
                              {sucursalesData?.items
                                .filter(s => s.suestado === 'activo')
                                .map((sucursal) => (
                                <SelectItem key={sucursal.suid} value={sucursal.suid}>
                                  {sucursal.sunombre} (ID: {sucursal.suidentificador})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cjidentificador"
                  render={({ field, fieldState }) => (
                    <ModalField label="Identificador (Ej: 001)" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={Fingerprint} className="h-11 rounded-xl" placeholder="001" maxLength={3} {...field} />
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
          handleOpenChange(false);
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
