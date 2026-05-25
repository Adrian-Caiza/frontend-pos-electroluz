import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useCreateSucursal } from '../hooks/useCreateSucursal';
import { Button } from '../../../../shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Plus } from 'lucide-react';

const formSchema = z.object({
  sunombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  suidentificador: z.string().length(3, 'El identificador debe tener exactamente 3 dígitos').regex(/^\d+$/, 'Solo se permiten números'),
  sudireccion: z.string().optional(),
  sucorreo: z.string().email('Debe ser un correo válido').or(z.literal('')).optional(),
});

export const CreateSucursalModal = () => {
  const [open, setOpen] = useState(false);
  const { company } = useAuthStore();
  const { mutate: createSucursal, isPending } = useCreateSucursal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sunombre: '',
      suidentificador: '',
      sudireccion: '',
      sucorreo: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!company) return;
    
    // Clean up empty strings to undefined to match optional backend rules if needed
    const payload = {
      suemid: company.emid,
      sunombre: values.sunombre,
      suidentificador: values.suidentificador,
      sudireccion: values.sudireccion || undefined,
      sucorreo: values.sucorreo || undefined,
    };

    createSucursal(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) form.reset();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
        <Plus className="w-4 h-4 mr-2" /> Nueva Sucursal
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Sucursal</DialogTitle>
            <DialogDescription>
              Añade una nueva sucursal a tu empresa. El identificador debe ser único.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="sunombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Sucursal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Sucursal Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="suidentificador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificador (Ej: 001)</FormLabel>
                    <FormControl>
                      <Input placeholder="001" maxLength={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sudireccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Av. Principal 123..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sucorreo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="sucursal@empresa.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
                  {isPending ? 'Guardando...' : 'Guardar Sucursal'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
