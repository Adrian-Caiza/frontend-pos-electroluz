import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCog, User, Mail, Lock, Shield, UploadCloud, X, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateUsuarioPassword } from '../hooks/useUpdateUsuarioPassword';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard,
  ModalChipGroup
} from '../../../../shared/components/ui/modal';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../shared/components/ui/form';
import { Input } from '../../../../shared/components/ui/input';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useUpdateUsuario } from '../hooks/useUpdateUsuario';
import type { Usuario } from '../../domain/entities/Usuario';

const formSchema = z.object({
  usnombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  uscorreo: z.string().email('Debe ser un correo válido').min(1, 'El correo es requerido'),
  usrol: z.enum(['jefe', 'empleado'], { message: 'El rol es requerido' }),
  uspassword: z.string().optional(),
  uspasswordConfirm: z.string().optional(),
}).refine((data) => {
  if (data.uspassword && data.uspassword.length > 0) {
    return data.uspassword.length >= 8;
  }
  return true;
}, {
  message: "La contraseña debe tener al menos 8 caracteres",
  path: ["uspassword"],
}).refine((data) => {
  if (data.uspassword && data.uspassword.length > 0) {
    return data.uspassword === data.uspasswordConfirm;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["uspasswordConfirm"],
});

type FormValues = z.infer<typeof formSchema>;

interface EditUsuarioModalProps {
  usuario: Usuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditUsuarioModal = ({ usuario, open, onOpenChange }: EditUsuarioModalProps) => {
  const { user: currentUser } = useAuthStore();
  const { mutate: updateUsuario, isPending: isUpdatingUser } = useUpdateUsuario();
  const { mutateAsync: updateUsuarioPassword, isPending: isUpdatingPassword } = useUpdateUsuarioPassword();
  const isPending = isUpdatingUser || isUpdatingPassword;
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
    mode: 'onChange',
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
        uspassword: '',
        uspasswordConfirm: '',
      });
      setImagePreview(getImageUrl(usuario.usimagen));
      setSelectedImage(null);
    }
  }, [usuario, open, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
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

    const hasPasswordChange = values.uspassword && values.uspassword.length > 0;
    const hasInfoChanges = Object.keys(payload).length > 0;

    if (!hasInfoChanges && !hasPasswordChange) {
      onOpenChange(false); // No changes made
      return;
    }

    const finalize = () => {
      onOpenChange(false);
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
    };

    if (hasInfoChanges) {
      updateUsuario(
        { id: usuario.usid, data: payload },
        {
          onSuccess: async () => {
            if (hasPasswordChange) {
              await updateUsuarioPassword({ id: usuario.usid, uspassword: values.uspassword! });
            }
            finalize();
          },
        }
      );
    } else if (hasPasswordChange) {
      updateUsuarioPassword({ id: usuario.usid, uspassword: values.uspassword! })
        .then(() => finalize())
        .catch(() => {}); // Error already handled in hook
    }
  };

  const footer = (
    <ModalFooter 
      onCancel={() => onOpenChange(false)} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Guardar Cambios"
    />
  );

  return (
    <BaseModal 
      isOpen={open} 
      onClose={() => onOpenChange(false)}
      title="Editar Usuario"
      subtitle="Actualice la información y permisos del usuario."
      size="lg"
      footer={footer}
    >
      <ModalEntityCard 
        icon={UserCog}
        title={usuario?.usnombre || 'Cargando...'}
        subtitle={`Rol: ${usuario?.usrol || ''}`}
        iconClassName="text-indigo-600 bg-indigo-50"
      />

      <Form {...form}>
        <form id="edit-usuario-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ModalSection title="Datos Personales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="usnombre"
                render={({ field, fieldState }) => (
                  <div className="md:col-span-2">
                    <ModalField label="Nombre Completo" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={User} className="h-11 rounded-xl" placeholder="Ej. Juan Perez" {...field} />
                      </FormControl>
                    </ModalField>
                  </div>
                )}
              />

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative w-16 h-16 shrink-0">
                    <label className="cursor-pointer block w-full h-full">
                      {imagePreview ? (
                        <div className="w-full h-full rounded-full overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-indigo-400 transition-colors">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".jpg,.png"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 shadow-sm hover:bg-rose-600 transition-colors z-10"
                        title="Eliminar foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">
                      Haga clic en el círculo para cambiar la foto.<br />
                      Si no seleccionas una, se mantendrá la actual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalSection>

          <ModalSection title="Datos de Acceso">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="uscorreo"
                render={({ field, fieldState }) => (
                  <div className={currentUser?.usrol === 'jefe' ? "" : "md:col-span-2"}>
                    <ModalField label="Correo Electrónico" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={Mail} className="h-11 rounded-xl" type="email" placeholder="juan.perez@empresa.com" {...field} />
                      </FormControl>
                    </ModalField>
                  </div>
                )}
              />

              {currentUser?.usrol === 'jefe' && (
                <FormField
                  control={form.control}
                  name="usrol"
                  render={({ field, fieldState }) => (
                    <ModalField label="Rol Operativo" required error={fieldState.error?.message}>
                      <FormControl>
                        <ModalChipGroup
                          options={[
                            { label: 'Jefe', value: 'jefe' },
                            { label: 'Empleado', value: 'empleado' }
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </ModalField>
                  )}
                />
              )}
            </div>
          </ModalSection>

          <ModalSection title="Cambiar Contraseña (Opcional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="uspassword"
                render={({ field, fieldState }) => (
                  <ModalField label="Nueva Contraseña" error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Lock} className="h-11 rounded-xl" type="password" placeholder="Mínimo 8 caracteres" {...field} value={field.value || ''} />
                    </FormControl>
                  </ModalField>
                )}
              />

              <FormField
                control={form.control}
                name="uspasswordConfirm"
                render={({ field, fieldState }) => (
                  <ModalField label="Repetir Contraseña" error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Shield} className="h-11 rounded-xl" type="password" placeholder="Mínimo 8 caracteres" {...field} value={field.value || ''} />
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
