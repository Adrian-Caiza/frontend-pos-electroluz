import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useCreateCheckout } from '../hooks/useCreateCheckout';
import { useSucursales } from '../../../sucursal/presentation/hooks/useSucursales';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  cjidentificador: z.string().length(3, 'El identificador debe tener exactamente 3 dígitos').regex(/^\d+$/, 'Solo se permiten números'),
  cjsuid: z.string().min(1, 'Debe seleccionar una sucursal'),
});

export const CreateCheckoutModal = () => {
  const [open, setOpen] = useState(false);
  const { company } = useAuthStore();
  const { mutate: createCheckout, isPending } = useCreateCheckout();
  
  // Asumimos que traemos suficientes sucursales (ej. 100) para el dropdown
  const { data: sucursalesData, isLoading: loadingSucursales } = useSucursales(1, 100);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
        <Plus className="w-4 h-4 mr-2" /> Nueva Caja
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Caja</DialogTitle>
            <DialogDescription>
              Crea una caja asignándole un identificador de 3 dígitos y vinculándola a una sucursal.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="cjsuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sucursal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingSucursales ? "Cargando sucursales..." : "Seleccione una sucursal"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sucursalesData?.items.map((sucursal) => (
                          <SelectItem key={sucursal.suid} value={sucursal.suid}>
                            {sucursal.sunombre} (ID: {sucursal.suidentificador})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cjidentificador"
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

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
                  {isPending ? 'Guardando...' : 'Guardar Caja'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
