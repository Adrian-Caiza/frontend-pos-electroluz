import { useState } from 'react';
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
  DialogTrigger,
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
import { Plus, Loader2, Upload } from 'lucide-react';
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

export const CreateProductoModal = () => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const createMutation = useCreateProducto();
  
  // Queries for relationships
  const { data: categoriasData, isLoading: loadingCat } = useCategorias(1, 100);
  const { data: marcasData, isLoading: loadingMarcas } = useMarcas(1, 100);
  const { data: proveedoresData, isLoading: loadingProv } = useProveedores(1, 100);
  const { data: medidasData, isLoading: loadingMedidas } = useMedidas(1, 100);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
    createMutation.mutate({
      ...values,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Registrar Producto</DialogTitle>
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
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                      <Input type="number" placeholder="5" {...field} />
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
                      <Input type="number" placeholder="50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Imagen */}
            <div>
              <FormLabel className="block mb-2">Imagen del Producto (Opcional)</FormLabel>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400" />
                  )}
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="text-sm text-slate-500">
                  <p>Formatos: JPG, PNG</p>
                  <p>Max: 5MB</p>
                  <p className="mt-1 font-medium text-slate-700">Click en el recuadro para subir</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
