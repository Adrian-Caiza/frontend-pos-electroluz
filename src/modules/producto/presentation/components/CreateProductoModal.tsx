import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { 
  PackagePlus, 
  FolderTree, 
  Tag, 
  Truck, 
  Scale, 
  Barcode, 
  Package, 
  DollarSign, 
  ArrowDownToLine, 
  ArrowUpToLine, 
  Upload, 
  X,
  Plus
} from 'lucide-react';
import {
  BaseModal,
  ModalFooter,
  ModalSection,
  ModalField,
  ModalEntityCard
} from '../../../../shared/components/ui/modal';
import {
  Form,
  FormControl,
  FormField,
} from '../../../../shared/components/ui/form';

import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useCreateProducto } from '../hooks/useCreateProducto';
import { useCategorias } from '../../../categoria/presentation/hooks/useCategorias';
import { useMarcas } from '../../../marca/presentation/hooks/useMarcas';
import { useProveedores } from '../../../proveedor/presentation/hooks/useProveedores';
import { useMedidas } from '../../../medida/presentation/hooks/useMedidas';

const formSchema = z.object({
  prdtoctgriaid: z.string().min(1, 'La categoría es requerida'),
  prdtomrcid: z.string().min(1, 'La marca es requerida'),
  prdtoprovid: z.string().min(1, 'El proveedor es requerido'),
  prdtomdiaid: z.string().min(1, 'La medida es requerida'),
  prdtocodigo: z.string().min(3, 'Mínimo 3 caracteres'),
  prdtonombre: z.string().min(3, 'Mínimo 3 caracteres'),
  prdtopreciocompra: z.string().min(1, 'Requerido'),
  prdtoprecioventa: z.string().min(1, 'Requerido'),
  prdtostockminimo: z.string().min(1, 'Requerido'),
  prdtostockmaximo: z.string().min(1, 'Requerido'),
});

type FormValues = z.infer<typeof formSchema>;

export interface CreateProductoModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateProductoModal = ({ open: controlledOpen, onOpenChange: setControlledOpen }: CreateProductoModalProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled && setControlledOpen ? setControlledOpen : setInternalOpen;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { company } = useAuthStore();
  const createMutation = useCreateProducto();
  
  // Queries for relationships
  const { data: categoriasData, isLoading: loadingCat } = useCategorias(1, 100);
  const { data: marcasData, isLoading: loadingMarcas } = useMarcas(1, 100);
  const { data: proveedoresData, isLoading: loadingProv } = useProveedores(1, 100);
  const { data: medidasData, isLoading: loadingMedidas } = useMedidas(1, 100);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      prdtoctgriaid: '',
      prdtomrcid: '',
      prdtoprovid: '',
      prdtomdiaid: '',
      prdtocodigo: '',
      prdtonombre: '',
      prdtopreciocompra: '',
      prdtoprecioventa: '',
      prdtostockminimo: '',
      prdtostockmaximo: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (values: FormValues) => {
    if (!company) return;

    createMutation.mutate({
      ...values,
      prdtoemid: company.emid,
      imagen: imageFile || undefined,
    }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        setImageFile(null);
        setImagePreview(null);
      }
    });
  };

  const footer = (
    <ModalFooter 
      onCancel={() => setOpen(false)} 
      onConfirm={form.handleSubmit(onSubmit)} 
      isLoading={createMutation.isPending}
      confirmLabel="Guardar Producto"
    />
  );

  return (
    <>
      {!isControlled && (
        <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      )}

      <BaseModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        title="Registrar Producto"
        subtitle="Complete los detalles para añadir un nuevo producto al catálogo."
        size="2xl"
        footer={footer}
      >
        <ModalEntityCard 
          icon={PackagePlus}
          title="Nuevo Producto"
          subtitle="Clasificación, precios y niveles de inventario"
        />

        <Form {...form}>
          <form id="create-producto-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <ModalSection title="Clasificación">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="prdtoctgriaid"
                  render={({ field, fieldState }) => (
                    <ModalField label="Categoría" required error={fieldState.error?.message}>
                      <FormControl>
                        <div className="relative">
                          <FolderTree className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <select
                            {...field}
                            disabled={loadingCat}
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-transparent pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Seleccione una categoría</option>
                            {categoriasData?.items.map(cat => (
                              <option key={cat.ctgriaid} value={cat.ctgriaid}>{cat.ctgnombre}</option>
                            ))}
                          </select>
                        </div>
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prdtomrcid"
                  render={({ field, fieldState }) => (
                    <ModalField label="Marca" required error={fieldState.error?.message}>
                      <FormControl>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <select
                            {...field}
                            disabled={loadingMarcas}
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-transparent pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Seleccione una marca</option>
                            {marcasData?.items.map(mrc => (
                              <option key={mrc.mrcid} value={mrc.mrcid}>{mrc.mrcnombre}</option>
                            ))}
                          </select>
                        </div>
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prdtoprovid"
                  render={({ field, fieldState }) => (
                    <ModalField label="Proveedor" required error={fieldState.error?.message}>
                      <FormControl>
                        <div className="relative">
                          <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <select
                            {...field}
                            disabled={loadingProv}
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-transparent pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Seleccione un proveedor</option>
                            {proveedoresData?.items.map(prov => (
                              <option key={prov.provid} value={prov.provid}>{prov.provnombre}</option>
                            ))}
                          </select>
                        </div>
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prdtomdiaid"
                  render={({ field, fieldState }) => (
                    <ModalField label="Medida" required error={fieldState.error?.message}>
                      <FormControl>
                        <div className="relative">
                          <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <select
                            {...field}
                            disabled={loadingMedidas}
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-transparent pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Seleccione una medida</option>
                            {medidasData?.items.map(mdia => (
                              <option key={mdia.mdiaid} value={mdia.mdiaid}>{mdia.mdianombre}</option>
                            ))}
                          </select>
                        </div>
                      </FormControl>
                    </ModalField>
                  )}
                />
              </div>
            </ModalSection>

            <ModalSection title="Detalles Principales">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="prdtocodigo"
                  render={({ field, fieldState }) => (
                    <ModalField label="Código" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={Barcode} className="h-11 rounded-xl" placeholder="Ej. PRD-001" {...field} />
                      </FormControl>
                    </ModalField>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prdtonombre"
                  render={({ field, fieldState }) => (
                    <ModalField label="Nombre del Producto" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={Package} className="h-11 rounded-xl" placeholder="Ej. Taladro Percutor 20V" {...field} />
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prdtopreciocompra"
                  render={({ field, fieldState }) => (
                    <ModalField label="Precio Compra ($)" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={DollarSign} type="number" step="0.01" className="h-11 rounded-xl" placeholder="0.00" {...field} />
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prdtoprecioventa"
                  render={({ field, fieldState }) => (
                    <ModalField label="Precio Venta ($)" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={DollarSign} type="number" step="0.01" className="h-11 rounded-xl" placeholder="0.00" {...field} />
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prdtostockminimo"
                  render={({ field, fieldState }) => (
                    <ModalField label="Stock Mínimo" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={ArrowDownToLine} type="number" className="h-11 rounded-xl" placeholder="5" {...field} />
                      </FormControl>
                    </ModalField>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prdtostockmaximo"
                  render={({ field, fieldState }) => (
                    <ModalField label="Stock Máximo" required error={fieldState.error?.message}>
                      <FormControl>
                        <Input icon={ArrowUpToLine} type="number" className="h-11 rounded-xl" placeholder="50" {...field} />
                      </FormControl>
                    </ModalField>
                  )}
                />

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Imagen del Producto (Opcional)
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 shrink-0">
                      <label className="cursor-pointer block w-full h-full">
                        {imagePreview ? (
                          <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-indigo-400 transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-sm hover:bg-rose-600 transition-colors z-10"
                          title="Eliminar foto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500">
                        Haga clic en el recuadro para subir una imagen.<br />
                        Formatos: JPG, PNG. Máximo: 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalSection>
          </form>
        </Form>
      </BaseModal>
    </>
  );
};
