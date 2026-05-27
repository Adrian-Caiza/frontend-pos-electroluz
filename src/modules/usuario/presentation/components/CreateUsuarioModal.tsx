import { useState } from 'react';
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
import { useCreateUsuario } from '../hooks/useCreateUsuario';
import { UploadCloud, X } from 'lucide-react';

const formSchema = z.object({
  usnombre: z.string().min(1, 'El nombre es requerido'),
  usapodo: z.string().min(1, 'El apodo es requerido'),
  uscorreo: z.string().email('Debe ser un correo válido').min(1, 'El correo es requerido'),
  uspassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  usrol: z.enum(['jefe', 'empleado'], { message: 'El rol es requerido' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateUsuarioModal = ({ open, onOpenChange }: CreateUsuarioModalProps) => {
  const { user, company } = useAuthStore();
  const { mutate: createUsuario, isPending } = useCreateUsuario();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usnombre: '',
      usapodo: '',
      uscorreo: '',
      uspassword: '',
      usrol: 'empleado',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const onSubmit = (values: FormValues) => {
    if (!company) return;

    createUsuario(
      {
        usemid: company.emid,
        usnombre: values.usnombre,
        usapodo: values.usapodo,
        uscorreo: values.uscorreo,
        uspassword: values.uspassword,
        usrol: values.usrol,
        imagen: selectedImage || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
          setSelectedImage(null);
          setImagePreview(null);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Registrar Usuario</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="usnombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Juan Perez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usapodo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apodo / Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. jperez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uscorreo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="juan.perez@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uspassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usrol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol Operativo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="jefe">Jefe</SelectItem>
                        <SelectItem value="empleado">Empleado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Foto de Perfil (Opcional)</FormLabel>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 shadow-sm hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-500">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".jpg,.png"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB
                  </p>
                </div>
              </div>
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
                {isPending ? 'Registrando...' : 'Registrar Usuario'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
