import {  useEffect , useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PackageMinus, Hash, Activity } from 'lucide-react';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';
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
import { useUpdateStock } from '../hooks/useUpdateStock';
import type { Stock } from '../../domain/entities/Stock';

const formSchema = z.object({
  stckcantidad: z.union([z.number(), z.string().max(255, 'El texto es demasiado largo'), z.undefined()])
    .refine((val) => val !== '' && val !== undefined, { message: 'Ingrese una cantidad' })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, { message: 'La cantidad no puede ser negativa' })
    .refine((val) => Number.isInteger(val), { message: 'La cantidad debe ser un número entero' }),
  stckestado: z.enum(['activo', 'inactivo', 'eliminado']),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.infer<typeof formSchema>;

interface EditStockModalProps {
  stock: Stock;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditStockModal = ({ stock, open, onOpenChange }: EditStockModalProps) => {
  const { mutate: updateStock, isPending } = useUpdateStock();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRequestClose = () => {
    if (form.formState.isDirty) {
      setIsConfirmOpen(true);
    } else {
      onOpenChange(false);
    }
  };

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      stckcantidad: Number(stock.stckcantidad) || 0,
      stckestado: stock.stckestado,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        stckcantidad: Number(stock.stckcantidad) || 0,
        stckestado: stock.stckestado,
      });
    }
  }, [open, form.reset, stock]);

  const onSubmit = (values: FormOutput) => {
    const payload: any = { stcksuid: stock.sucursal.suid }; // Obligatorio para API

    // Solo enviamos lo que cambió para evitar conflictos
    if (values.stckcantidad !== Number(stock.stckcantidad)) {
      payload.stckcantidad = values.stckcantidad;
    }
    if (values.stckestado !== stock.stckestado) {
      payload.stckestado = values.stckestado;
    }

    // Si no hay cambios, cerramos
    if (Object.keys(payload).length === 1) { // Solo tiene stcksuid
      onOpenChange(false);
      return;
    }

    updateStock(
      { id: stock.stckid, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const footer = (
    <ModalFooter 
      onCancel={handleRequestClose} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Ajuste"
    />
  );

  form.formState.isDirty; // Force tracking
  return (
    <>
      <BaseModal 
      isOpen={open} 
      onClose={handleRequestClose}
      title="Ajuste de Bodega"
      subtitle={`Modifica la cantidad o estado del producto en la ${stock.sucursal.sunombre}.`}
      size="md"
      footer={footer}
    >
      <ModalEntityCard 
        icon={PackageMinus}
        title={stock.producto.prdtonombre || 'Producto Cargando...'}
        subtitle={`Sucursal: ${stock.sucursal.sunombre || ''}`}
        iconClassName="text-amber-600 bg-amber-50"
      />

      <Form {...form}>
        <form id="edit-stock-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ModalSection title="Ajuste de Inventario">
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="stckcantidad"
                render={({ field, fieldState }) => (
                  <ModalField label="Nueva Cantidad" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input 
                        icon={Hash}
                        type="number" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? '' : Number(val));
                        }}
                        className="h-11 rounded-xl"
                        min="0"
                        step="1"
                      />
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="stckestado"
                render={({ field, fieldState }) => (
                  <ModalField label="Estado del Lote" required error={fieldState.error?.message}>
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
