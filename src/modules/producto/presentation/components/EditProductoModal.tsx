import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { useUpdateProducto } from '../hooks/useUpdateProducto';
import { useCategorias } from '../../../categoria/presentation/hooks/useCategorias';
import { useMarcas } from '../../../marca/presentation/hooks/useMarcas';
import { useProveedores } from '../../../proveedor/presentation/hooks/useProveedores';
import { useMedidas } from '../../../medida/presentation/hooks/useMedidas';
import type { Producto } from '../../domain/entities/Producto';

const formSchema = z.object({
  prdtoctgriaid: z.string().optional(),
  prdtomrcid: z.string().optional(),
  prdtoprovid: z.string().optional(),
  prdtomdiaid: z.string().optional(),
  prdtocodigo: z.string().min(3).optional(),
  prdtonombre: z.string().min(3).optional(),
  prdtopreciocompra: z.string().optional(),
  prdtoprecioventa: z.string().optional(),
  prdtostockminimo: z.string().optional(),
  prdtostockmaximo: z.string().optional(),
  prdtoestado: z.enum(['activo', 'inactivo', 'eliminado']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProductoModalProps {
  producto: Producto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProductoModal = ({ producto, open, onOpenChange }: EditProductoModalProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const updateMutation = useUpdateProducto();

  const { data: categoriasData, isLoading: loadingCat } = useCategorias(1, 100);
  const { data: marcasData, isLoading: loadingMarcas } = useMarcas(1, 100);
  const { data: proveedoresData, isLoading: loadingProv } = useProveedores(1, 100);
  const { data: medidasData, isLoading: loadingMedidas } = useMedidas(1, 100);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prdtoestado: 'activo',
    },
  });

  useEffect(() => {
    if (producto && open) {
      form.reset({
        prdtoctgriaid: producto.categoria?.ctgriaid || '',
        prdtomrcid: producto.marca?.mrcid || '',
        prdtoprovid: producto.proveedor?.provid || '',
        prdtomdiaid: producto.medida?.mdiaid || '',
        prdtocodigo: producto.prdtocodigo,
        prdtonombre: producto.prdtonombre,
        prdtopreciocompra: producto.prdtopreciocompra,
        prdtoprecioventa: producto.prdtoprecioventa,
        prdtostockminimo: producto.prdtostockminimo,
        prdtostockmaximo: producto.prdtostockmaximo,
        prdtoestado: producto.prdtoestado,
      });
      setImagePreview(producto.prdtoimagen);
      setImageFile(null);
    }
  }, [producto, open, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

  const onSubmit = (values: FormValues) => {
    if (!producto) return;
    updateMutation.mutate({
      id: producto.prdtoid,
      data: {
        ...values,
        imagen: imageFile || undefined,
      },
    }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Producto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Relaciones */}
              <FormField
                control={form.control}
                name="prdtoctgriaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCat}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriasData?.items.map(cat => (
                          <SelectItem key={cat.ctgriaid} value={cat.ctgriaid}>{cat.ctgnombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prdtomrcid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingMarcas}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marcasData?.items.map(mrc => (
                          <SelectItem key={mrc.mrcid} value={mrc.mrcid}>{mrc.mrcnombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prdtoprovid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingProv}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un proveedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {proveedoresData?.items.map(prov => (
                          <SelectItem key={prov.provid} value={prov.provid}>{prov.provnombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prdtomdiaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medida</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingMedidas}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una medida" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medidasData?.items.map(mdia => (
                          <SelectItem key={mdia.mdiaid} value={mdia.mdiaid}>{mdia.mdianombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Text Inputs */}
              <FormField
                control={form.control}
                name="prdtocodigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. PRD-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prdtonombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Taladro Percutor 20V" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prdtopreciocompra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Compra ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prdtoprecioventa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Venta ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prdtostockminimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Mínimo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prdtostockmaximo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Máximo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Imagen e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prdtoestado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="eliminado">Eliminado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="block mb-2">Imagen (Opcional)</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors shrink-0">
                    {imagePreview ? (
                      <img src={getImageUrl(imagePreview)!} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-400" />
                    )}
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg" 
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-slate-500 flex flex-col justify-center items-start">
                    {imagePreview ? (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        className="h-6 px-2 text-[10px]" 
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          const fileInputs = document.querySelectorAll('input[type="file"]');
                          fileInputs.forEach(input => { (input as HTMLInputElement).value = ''; });
                        }}
                      >
                        Quitar imagen
                      </Button>
                    ) : (
                      <p>Click para cambiar foto</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Actualizar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
