import { useMemo } from 'react';
import { useProformas } from '../../../proforma/presentation/hooks/useProformas';
import { useProductos } from '../../../producto/presentation/hooks/useProductos';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const useDashboardStats = () => {
  
  const { data: proformasData, isLoading: isLoadingProformas } = useProformas(1, 1000);
  const { data: productosData, isLoading: isLoadingProductos } = useProductos(1, 10000);

  const isLoading = isLoadingProformas || isLoadingProductos;

  
  const salesTrendData = useMemo(() => {
    if (!proformasData?.items) return [];
    
    
    const grouped = proformasData.items.reduce((acc: any, proforma: any) => {
     
      if (proforma.prfmaestado === 'anulada' || proforma.prfmaestado === 'cancelada') return acc;

      const dateStr = proforma.prfmafchregistro.split('T')[0];
      if (!acc[dateStr]) acc[dateStr] = 0;
      acc[dateStr] += proforma.total?.prfmatotal || 0;
      return acc;
    }, {});

    
    return Object.entries(grouped)
      .map(([date, total]) => ({
        date: format(parseISO(date), 'dd MMM', { locale: es }),
        rawDate: date,
        total: Number((total as number).toFixed(2))
      }))
      .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
  }, [proformasData]);

  
  const topProductsData = useMemo(() => {
    if (!proformasData?.items) return [];

    const productCounts: Record<string, { name: string; count: number }> = {};

    proformasData.items.forEach((proforma: any) => {
     
      if (proforma.prfmaestado === 'anulada' || proforma.prfmaestado === 'cancelada') return;

      proforma.detalle?.forEach((item: any) => {
        const key = item.producto.dprfmacodigo || item.producto.dprfmadescripcion;
        if (!key) return;

        if (!productCounts[key]) {
          productCounts[key] = {
            name: item.producto.dprfmadescripcion,
            count: 0
          };
        }
        productCounts[key].count += item.producto.dprfmacantidad;
      });
    });

    return Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); 
  }, [proformasData]);

 
  const proformaStatusData = useMemo(() => {
    if (!proformasData?.items) return [];

    const counts = { emitida: 0, pagada: 0, anulada: 0, cancelada: 0 };
    
    proformasData.items.forEach((proforma: any) => {
      const status = proforma.prfmaestado as keyof typeof counts;
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    
    return [
      { name: 'Pagadas', value: counts.pagada, fill: 'var(--color-emerald-500)' },
      { name: 'Emitidas (Pendientes)', value: counts.emitida, fill: 'var(--color-blue-500)' },
      { name: 'Anuladas', value: counts.anulada + counts.cancelada, fill: 'var(--color-red-500)' }
    ].filter(item => item.value > 0);
  }, [proformasData]);

  
  const categoryCompositionData = useMemo(() => {
    if (!proformasData?.items || !productosData?.items) return [];

    
    const productCategoryMap = new Map<string, string>();
    productosData.items.forEach((p: any) => {
      if (p.prdtocodigo && p.categoria?.ctgnombre) {
        productCategoryMap.set(p.prdtocodigo, p.categoria.ctgnombre);
      }
    });

    const categoryTotals: Record<string, number> = {};

    proformasData.items.forEach((proforma: any) => {
      if (proforma.prfmaestado === 'anulada' || proforma.prfmaestado === 'cancelada') return;

      proforma.detalle?.forEach((item: any) => {
        const codigo = item.producto.dprfmacodigo;
        
        const categoryName = codigo ? productCategoryMap.get(codigo) || 'Otros / Servicios' : 'Otros / Servicios';
        
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = 0;
        }
        categoryTotals[categoryName] += item.producto.dprfmapreciototal;
      });
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }))
      .sort((a, b) => b.value - a.value);
  }, [proformasData, productosData]);

  return {
    isLoading,
    salesTrendData,
    topProductsData,
    proformaStatusData,
    categoryCompositionData
  };
};
