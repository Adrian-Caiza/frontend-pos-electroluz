import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, PenTool } from 'lucide-react';
import { useTerminalCart } from '../../hooks/useTerminalCart';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard
} from '../../../../../shared/components/ui/modal';
import { Button } from '../../../../../shared/components/ui/button';
import { Input } from '../../../../../shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../../shared/components/ui/form';
import { Hash, AlignLeft, DollarSign } from 'lucide-react';
import { useState } from 'react';

const manualItemSchema = z.object({
  descripcion: z.string().min(2, 'La descripción debe tener al menos 2 caracteres'),
  cantidad: z.number().min(1, 'La cantidad mínima es 1'),
  precioUnitario: z.number().min(0.01, 'El precio debe ser mayor a 0'),
});

type ManualItemFormData = z.infer<typeof manualItemSchema>;

export const ManualItemModal = () => {
  const [open, setOpen] = useState(false);
  const addItem = useTerminalCart(state => state.addItem);

  const form = useForm<ManualItemFormData>({
    resolver: zodResolver(manualItemSchema),
    mode: 'onChange',
    defaultValues: {
      cantidad: 1,
      precioUnitario: 0,
    }
  });

  const onSubmit = (data: ManualItemFormData) => {
    addItem({
      id: crypto.randomUUID(), // Local unique ID
      esInventariable: false,
      codigo: undefined, // Manual items don't have a code usually
      descripcion: data.descripcion,
      cantidad: data.cantidad,
      precioUnitario: data.precioUnitario,
    });
    
    form.reset();
    setOpen(false);
  };

  const footer = (
    <ModalFooter 
      onCancel={() => {
        setOpen(false);
        form.reset();
      }} 
      onConfirm={form.handleSubmit(onSubmit)} 
      confirmLabel="Agregar al Carrito"
    />
  );

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm">
        <PenTool className="w-4 h-4 mr-2" />
        Servicio Manual
      </Button>

      <BaseModal 
        isOpen={open} 
        onClose={() => {
          setOpen(false);
          form.reset();
        }}
        title="Agregar Servicio o Ítem Manual"
        subtitle="Registra temporalmente un servicio o artículo que no está en el inventario."
        size="md"
        footer={footer}
      >
        <ModalEntityCard 
          icon={PenTool}
          title="Servicio/Ítem"
          subtitle="Complete los detalles del servicio"
        />

        <Form {...form}>
          <form id="manual-item-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ModalSection title="Detalles del Servicio">
              <div className="grid grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field, fieldState }) => (
                    <ModalField label="Descripción" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={AlignLeft} className="h-11 rounded-xl" placeholder="Ej: Flete, Instalación, Mano de obra" {...field} />
                      </FormControl>
                    </ModalField>
                  )}
                />

                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="cantidad"
                    render={({ field, fieldState }) => (
                      <ModalField label="Cantidad" required error={fieldState.error?.message}>
                        <FormControl>
                          <Input 
                            icon={Hash} 
                            type="number" 
                            className="h-11 rounded-xl" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          />
                        </FormControl>
                      </ModalField>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="precioUnitario"
                    render={({ field, fieldState }) => (
                      <ModalField label="Precio Unitario ($)" required error={fieldState.error?.message}>
                        <FormControl>
                          <Input 
                            icon={DollarSign} 
                            type="number" 
                            step="0.01" 
                            className="h-11 rounded-xl" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          />
                        </FormControl>
                      </ModalField>
                    )}
                  />
                </div>
              </div>
            </ModalSection>
          </form>
        </Form>
      </BaseModal>
    </>
  );
};
