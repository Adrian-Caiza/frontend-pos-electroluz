import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
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
import { Button } from '../../../../shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useCreateCliente } from '../hooks/useCreateCliente';

const formSchema = z.object({
  clntetipoidentificacion: z.enum(['cedula', 'ruc'], {
    message: 'El tipo de identificación es requerido',
  }),
  clnteidentificacion: z.string().min(1, 'La identificación es requerida'),
  clntenombre: z.string().min(1, 'El nombre es requerido'),
  clntecorreo: z.string().email('Debe ser un correo válido').min(1, 'El correo es requerido'),
  clntedireccion: z.string().min(1, 'La dirección es requerida'),
  clntetelefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos').max(10, 'El teléfono no puede tener más de 10 dígitos'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateClienteModal = ({ open, onOpenChange }: CreateClienteModalProps) => {
  const { company } = useAuthStore();
  const { mutate: createCliente, isPending } = useCreateCliente();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clntetipoidentificacion: 'cedula',
      clnteidentificacion: '',
      clntenombre: '',
      clntecorreo: '',
      clntedireccion: '',
      clntetelefono: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: FormValues) => {
    if (!company?.emid) return;

    createCliente(
      { ...values, clnteemid: company.emid },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Registrar Cliente</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clntetipoidentificacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Identificación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cedula">Cédula</SelectItem>
                        <SelectItem value="ruc">RUC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clnteidentificacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificación</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. 1712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clntenombre"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nombre o Razón Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Juan Perez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clntecorreo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cliente@correo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clntetelefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. 0987654321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clntedireccion"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Av. Principal y Calle 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-slate-900 hover:bg-slate-800">
                {isPending ? 'Guardando...' : 'Guardar Cliente'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
