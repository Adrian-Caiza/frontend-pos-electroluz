import { useState, useEffect } from 'react';
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
import { useUpdateUsuario } from '../hooks/useUpdateUsuario';
import type { Usuario } from '../../domain/entities/Usuario';
import { UploadCloud, X } from 'lucide-react';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const formSchema = z.object({
  usnombre: z.string().min(1, 'El nombre es requerido'),
  uscorreo: z.string().email('Debe ser un correo válido').min(1, 'El correo es requerido'),
  usrol: z.enum(['jefe', 'empleado'], { message: 'El rol es requerido' }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUsuarioModalProps {
  usuario: Usuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditUsuarioModal = ({ usuario, open, onOpenChange }: EditUsuarioModalProps) => {
  const { user: currentUser } = useAuthStore();
  const { mutate: updateUsuario, isPending } = useUpdateUsuario();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getImageUrl = (rawPath: string | null) => {
    if (!rawPath || rawPath === 'null' || rawPath === 'undefined' || rawPath.trim() === '') return null;
    
    const imagePath = rawPath.replace(/\\/g, '/');
    if (imagePath.startsWith('blob:')) return imagePath;

    if (imagePath.startsWith('http')) {
      try {
        const url = new URL(imagePath);
        const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
        const isApiHost = import.meta.env.VITE_API_URL && url.hostname === new URL(import.meta.env.VITE_API_URL).hostname;
        const isKnownIP = url.hostname === '163.245.192.54';
        
        if (isLocalhost || isApiHost || isKnownIP) {
          return `/api-proxy${url.pathname}`;
        }
        return imagePath;
      } catch (e) {
        return imagePath;
      }
    }
    
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `/api-proxy${path}`;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usnombre: '',
      uscorreo: '',
      usrol: 'empleado',
    },
  });

  useEffect(() => {
    if (usuario && open) {
      form.reset({
        usnombre: usuario.usnombre,
        uscorreo: usuario.uscorreo,
        usrol: usuario.usrol === 'administrador' ? 'jefe' : usuario.usrol, // Fallback safely
      });
      setImagePreview(getImageUrl(usuario.usimagen));
      setSelectedImage(null);
    }
  }, [usuario, open, form]);

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
    if (!usuario) return;

    const payload: any = {};

    if (values.usnombre !== usuario.usnombre) {
      payload.usnombre = values.usnombre;
    }
    if (values.uscorreo !== usuario.uscorreo) {
      payload.uscorreo = values.uscorreo;
    }

    if (currentUser?.usrol === 'jefe' && values.usrol !== usuario.usrol) {
      payload.usrol = values.usrol;
    }

    if (selectedImage) {
      payload.imagen = selectedImage;
    }

    if (Object.keys(payload).length === 0) {
      onOpenChange(false); // No changes made
      return;
    }

    updateUsuario(
      { id: usuario.usid, data: payload },
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
          <DialogTitle className="text-xl font-bold text-slate-900">Editar Usuario</DialogTitle>
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

              {currentUser?.usrol === 'jefe' && (
                <FormField
                  control={form.control}
                  name="usrol"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Rol Operativo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            </div>

            <div className="space-y-2">
              <FormLabel>Foto de Perfil</FormLabel>
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
                    Si no subes una nueva imagen, se mantendrá la actual.
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
                {isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
