import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PackagePlus, Building2, Package, Hash } from 'lucide-react';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard
} from '../../../../shared/components/ui/modal';
import { Input } from '../../../../shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../shared/components/ui/form';
import { useCreateStock } from '../hooks/useCreateStock';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useSucursales } from '../../../sucursal/presentation/hooks/useSucursales';
import { useProductos } from '../../../producto/presentation/hooks/useProductos';

const formSchema = z.object({
  stcksuid: z.string().min(1, 'Seleccione una sucursal'),
  stckprdtoid: z.string().min(1, 'Seleccione un producto'),
  stckcantidad: z.union([z.number(), z.string(), z.undefined()])
    .refine((val) => val !== '' && val !== undefined, { message: 'Ingrese una cantidad' })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, { message: 'La cantidad no puede ser negativa' })
    .refine((val) => Number.isInteger(val), { message: 'La cantidad debe ser un número entero' }),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.infer<typeof formSchema>;

interface CreateStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSucursalId?: string; // Para preseleccionar si el usuario ya está viendo una sucursal
}

export const CreateStockModal = ({ open, onOpenChange, defaultSucursalId }: CreateStockModalProps) => {
  const { company } = useAuthStore();
  const { mutate: createStock, isPending } = useCreateStock();
  
  // Cargamos sucursales y productos para los selects (traemos bastantes para el dropdown)
  const { data: sucursalesData } = useSucursales(1, 100);
  const { data: productosData } = useProductos(1, 100);

  const activeSucursales = sucursalesData?.items.filter(s => s.suestado === 'activo') || [];
  const activeProductos = productosData?.items.filter(p => p.prdtoestado === 'activo') || [];

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      stcksuid: defaultSucursalId || '',
      stckprdtoid: '',
      stckcantidad: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        stcksuid: defaultSucursalId || '',
        stckprdtoid: '',
        stckcantidad: '',
      });
    }
  }, [open, form.reset, defaultSucursalId]);

  const onSubmit = (values: FormOutput) => {
    if (!company?.emid) return;

    createStock(
      {
        stckemid: company.emid,
        stcksuid: values.stcksuid,
        stckprdtoid: values.stckprdtoid,
        stckcantidad: values.stckcantidad,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  const footer = (
    <ModalFooter 
      onCancel={() => onOpenChange(false)} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Registrar Stock"
    />
  );

  return (
    <BaseModal 
      isOpen={open} 
      onClose={() => onOpenChange(false)}
      title="Ingreso de Mercancía"
      subtitle="Registra un nuevo lote de producto para una sucursal."
      size="md"
      footer={footer}
    >
      <ModalEntityCard 
        icon={PackagePlus}
        title="Nuevo Stock"
        subtitle="Complete los detalles del inventario"
      />

      <Form {...form}>
        <form id="create-stock-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ModalSection title="Detalles del Producto">
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="stcksuid"
                render={({ field, fieldState }) => (
                  <ModalField label="Sucursal de Destino" required error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                          {...field}
                          className="flex h-11 w-full rounded-xl border border-input bg-transparent dark:bg-slate-900 text-foreground pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Seleccione una sucursal</option>
                          {activeSucursales.map((sucursal) => (
                            <option key={sucursal.suid} value={sucursal.suid}>
                              {sucursal.sunombre} (Identificador: {sucursal.suidentificador})
                            </option>
                          ))}
                        </select>
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="stckprdtoid"
                render={({ field, fieldState }) => (
                  <ModalField label="Producto" required error={fieldState.error?.message}>
                    <FormControl>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                          {...field}
                          className="flex h-11 w-full rounded-xl border border-input bg-transparent dark:bg-slate-900 text-foreground pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Seleccione un producto</option>
                          {activeProductos.map((producto) => (
                            <option key={producto.prdtoid} value={producto.prdtoid}>
                              {producto.prdtocodigo} - {producto.prdtonombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="stckcantidad"
                render={({ field, fieldState }) => (
                  <ModalField label="Cantidad Inicial" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input 
                        icon={Hash}
                        type="number"
                        min="0"
                        step="1" 
                        {...field} 
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? '' : Number(val));
                        }}
                        className="h-11 rounded-xl"
                        placeholder="Ingrese la cantidad" 
                      />
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
