import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateSucursal } from '../hooks/useUpdateSucursal';
import type { Sucursal } from '../../domain/entities/Sucursal';
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

const formSchema = z.object({
  sunombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional().or(z.literal('')),
  suidentificador: z.string().length(3, 'El identificador debe tener exactamente 3 dígitos').regex(/^\d+$/, 'Solo se permiten números').optional().or(z.literal('')),
  sudireccion: z.string().optional(),
  sucorreo: z.string().email('Debe ser un correo válido').or(z.literal('')).optional(),
});

interface EditSucursalModalProps {
  sucursal: Sucursal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditSucursalModal = ({ sucursal, open, onOpenChange }: EditSucursalModalProps) => {
  const { mutate: updateSucursal, isPending } = useUpdateSucursal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sunombre: sucursal.sunombre,
      suidentificador: sucursal.suidentificador,
      sudireccion: sucursal.sudireccion || '',
      sucorreo: sucursal.sucorreo || '',
    },
  });

  // Actualizar valores del formulario si la sucursal seleccionada cambia
  useEffect(() => {
    form.reset({
      sunombre: sucursal.sunombre,
      suidentificador: sucursal.suidentificador,
      sudireccion: sucursal.sudireccion || '',
      sucorreo: sucursal.sucorreo || '',
    });
  }, [sucursal, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      sunombre: values.sunombre || undefined,
      suidentificador: values.suidentificador || undefined,
      sudireccion: values.sudireccion || undefined,
      sucorreo: values.sucorreo || undefined,
    };

    updateSucursal(
      { id: sucursal.suid, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Sucursal</DialogTitle>
          <DialogDescription>
            Modifica la información de la sucursal.
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
                  <FormLabel>Dirección</FormLabel>
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
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="sucursal@empresa.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
                {isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
