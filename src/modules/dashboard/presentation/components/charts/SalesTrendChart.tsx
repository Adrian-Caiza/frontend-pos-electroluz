import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartCardWrapper } from '../../../../../shared/components/ui/charts/ChartCardWrapper';

interface SalesTrendChartProps {
  data: Array<{ date: string; total: number; rawDate: string }>;
  isLoading?: boolean;
}

export const SalesTrendChart = ({ data, isLoading }: SalesTrendChartProps) => {
  return (
    <ChartCardWrapper 
      title="Tendencia de Ventas" 
      description="Ingresos diarios basados en proformas emitidas y pagadas"
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-slate-400 animate-pulse">Cargando datos...</div>
      ) : data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-slate-400">No hay suficientes datos</div>
      ) : (
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-slate-200)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--color-slate-500)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--color-slate-500)' }}
            tickFormatter={(value) => `$${value}`}
            dx={-10}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ventas']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            name="Ingresos"
            dataKey="total" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      )}
    </ChartCardWrapper>
  );
};
