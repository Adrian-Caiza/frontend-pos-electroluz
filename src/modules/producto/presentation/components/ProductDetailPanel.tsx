import { useProductoStore } from '../store/useProductoStore';
import { DetailPanel } from '../../../../shared/components/ui/detail-panel/DetailPanel';
import { getImageUrl } from '../table/columns';
import { Button } from '../../../../shared/components/ui/button';
import { Pencil, Trash2, Package, Tag, Archive, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { Badge } from '../../../../shared/components/ui/badge';
import { cn } from '../../../../shared/lib/utils';
import { formatCurrency } from '@/shared/utils/formatCurrency';

export const ProductDetailPanel = () => {
  const { selectedProduct, isDetailOpen, closeDetail } = useProductoStore();

  if (!selectedProduct) return null;

  const imageUrl = getImageUrl(selectedProduct.prdtoimagen) || '/placeholder-image.png';
  
  // Calculate Profit Margin
  const costPrice = Number(selectedProduct.prdtopreciocompra) || 0;
  const sellPrice = Number(selectedProduct.prdtoprecioventa) || 0;
  const marginRaw = costPrice > 0 ? ((sellPrice - costPrice) / costPrice) * 100 : 0;
  const margin = marginRaw.toFixed(2);
  const isGoodMargin = marginRaw >= 20;

  // Stock representation (using stockMaximo as current stock, per user agreement)
  const currentStock = Number(selectedProduct.prdtostockmaximo) || 0;
  const minStock = Number(selectedProduct.prdtostockminimo) || 0;
  
  // We need a theoretical max capacity to draw a progress bar nicely.
  // If currentStock is greater than minStock, let's say capacity is currentStock * 1.5
  // If currentStock is 0, capacity is minStock * 2
  const capacity = Math.max(currentStock * 1.2, minStock * 2, 10); 
  const stockPercentage = Math.min((currentStock / capacity) * 100, 100);
  const minStockPercentage = Math.min((minStock / capacity) * 100, 100);

  const getStockColor = () => {
    if (currentStock <= 0) return 'text-red-600 bg-red-100 border-red-200';
    if (currentStock <= minStock) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-emerald-600 bg-emerald-100 border-emerald-200';
  };

  const getProgressBarColor = () => {
    if (currentStock <= 0) return 'bg-red-500';
    if (currentStock <= minStock) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  return (
    <DetailPanel isOpen={isDetailOpen} onClose={closeDetail}>
      <div className="flex flex-col h-full bg-slate-50/50">
        
        {/* Header Section */}
        <div className="bg-white p-6 border-b border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div className="w-24 h-24 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {imageUrl !== '/placeholder-image.png' ? (
                <img src={imageUrl} alt={selectedProduct.prdtonombre} className="w-full h-full object-contain p-2" />
              ) : (
                <Package className="w-8 h-8 text-slate-300" />
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-slate-600">
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Eliminar</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {selectedProduct.prdtonombre}
              </h2>
              <p className="text-sm font-mono text-slate-500 mt-1.5">
                {selectedProduct.prdtocodigo}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100 shadow-none">
                {selectedProduct.categoria?.ctgnombre || 'Sin Categoría'}
              </Badge>
              <Badge variant="outline" className="text-slate-600 bg-white">
                {selectedProduct.marca?.mrcnombre || 'Sin Marca'}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("bg-white", 
                  selectedProduct.prdtoestado === 'activo' && "text-emerald-700 border-emerald-200 bg-emerald-50",
                  selectedProduct.prdtoestado === 'inactivo' && "text-amber-700 border-amber-200 bg-amber-50",
                  selectedProduct.prdtoestado === 'eliminado' && "text-red-700 border-red-200 bg-red-50"
                )}
              >
                {selectedProduct.prdtoestado.charAt(0).toUpperCase() + selectedProduct.prdtoestado.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* General Info */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              Información General
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Categoría</p>
                <p className="text-sm font-medium text-slate-800">{selectedProduct.categoria?.ctgnombre || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Marca</p>
                <p className="text-sm font-medium text-slate-800">{selectedProduct.marca?.mrcnombre || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Unidad de Medida</p>
                <p className="text-sm font-medium text-slate-800">{selectedProduct.medida?.mdianombre || 'N/A'} ({selectedProduct.medida?.mdiaabreviatura || '-'})</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Proveedor</p>
                <p className="text-sm font-medium text-slate-800 truncate" title={selectedProduct.proveedor?.provnombre || 'N/A'}>
                  {selectedProduct.proveedor?.provnombre || 'N/A'}
                </p>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-400" />
              Estructura de Precios
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                <p className="text-xs text-slate-500 mb-1">Costo (Compra)</p>
                <p className="text-lg font-semibold text-slate-700">{formatCurrency(costPrice)}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm flex flex-col justify-between ring-1 ring-indigo-500/10">
                <p className="text-xs text-indigo-600 mb-1 font-medium">Precio de Venta</p>
                <p className="text-xl font-bold text-indigo-700">{formatCurrency(sellPrice)}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  Margen
                  <TrendingUp className={cn("w-3 h-3", isGoodMargin ? "text-emerald-500" : "text-red-500")} />
                </p>
                <p className={cn("text-lg font-bold", isGoodMargin ? "text-emerald-600" : "text-red-600")}>
                  {margin}%
                </p>
              </div>
            </div>
          </section>

          {/* Stock Info */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Archive className="w-4 h-4 text-slate-400" />
              Disponibilidad e Inventario
            </h3>
            
            <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Stock Actual</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900">{currentStock}</span>
                    <span className="text-sm font-medium text-slate-500">{selectedProduct.medida?.mdiaabreviatura}</span>
                  </div>
                </div>
                <div className={cn("px-3 py-1 rounded-full border text-xs font-semibold", getStockColor())}>
                  {currentStock <= 0 ? 'Agotado' : currentStock <= minStock ? 'Stock Bajo' : 'En Stock'}
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-2">
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-500", getProgressBarColor())}
                    style={{ width: `${stockPercentage}%` }}
                  />
                  {/* Min Stock Marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10"
                    style={{ left: `${minStockPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0</span>
                  <span className="flex flex-col items-center relative -left-3">
                    <span className="text-red-500 font-medium">Mín {minStock}</span>
                  </span>
                  <span>{Math.round(capacity)}</span>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </DetailPanel>
  );
};
