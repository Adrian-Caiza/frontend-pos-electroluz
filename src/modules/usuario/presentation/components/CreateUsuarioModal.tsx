import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, User, Mail, Lock, Shield, UploadCloud, X, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';
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
import { useCreateUsuario } from '../hooks/useCreateUsuario';

const formSchema = z.object({
  usnombre: z.string().max(255, 'El texto es demasiado largo').min(3, 'El nombre debe tener al menos 3 caracteres'),
  usapodo: z.string().max(255, 'El texto es demasiado largo').min(3, 'El apodo debe tener al menos 3 caracteres'),
  uscorreo: z.string().max(255, 'El texto es demasiado largo').email('Debe ser un correo válido').min(1, 'El correo es requerido'),
  uspassword: z.string().max(255, 'El texto es demasiado largo').min(8, 'La contraseña debe tener al menos 8 caracteres'),
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

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRequestClose = () => {
    if (form.formState.isDirty) {
      setIsConfirmOpen(true);
    } else {
      onOpenChange(false);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
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
        toast.error('Ocurrió un error', {
        description: 'La imagen no debe superar los 5MB'
      });
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

  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [open, form]);

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

  const footer = (
    <ModalFooter 
      onCancel={handleRequestClose} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={isPending}
      confirmLabel="Registrar Usuario"
    />
  );

  form.formState.isDirty; // Force tracking
  return (
    <>
      <BaseModal 
      isOpen={open} 
      onClose={handleRequestClose}
      title="Registrar Usuario"
      subtitle="Complete los datos personales y de acceso del nuevo usuario."
      size="lg"
      footer={footer}
    >
      <ModalEntityCard 
        icon={UserPlus}
        title="Nuevo Usuario"
        subtitle="Los campos con asterisco (*) son obligatorios"
      />

      <Form {...form}>
        <form id="create-usuario-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <FormField
                control={form.control}
                name="usapodo"
                render={({ field, fieldState }) => (
                  <ModalField label="Apodo / Nickname" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={User} className="h-11 rounded-xl" placeholder="Ej. jperez" {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600">
                  Foto de Perfil (Opcional)
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
                      Haga clic en el círculo para subir una foto.<br />
                      Máximo: 5MB (JPG, PNG)
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
                  <div className="md:col-span-2">
                    <ModalField label="Correo Electrónico" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={Mail} className="h-11 rounded-xl" type="email" placeholder="juan.perez@empresa.com" {...field} />
                      </FormControl>
                    </ModalField>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="uspassword"
                render={({ field, fieldState }) => (
                  <ModalField label="Contraseña" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input icon={Lock} className="h-11 rounded-xl" type="password" placeholder="Mínimo 8 caracteres" {...field} />
                    </FormControl>
                  </ModalField>
                )}
              />

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
