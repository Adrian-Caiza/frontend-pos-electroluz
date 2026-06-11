import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCardWrapper } from '../../../../../shared/components/ui/charts/ChartCardWrapper';

interface TopProductsChartProps {
  data: Array<{ name: string; count: number }>;
  isLoading?: boolean;
}

export const TopProductsChart = ({ data, isLoading }: TopProductsChartProps) => {
  return (
    <ChartCardWrapper 
      title="Top 5 Productos" 
      description="Los artículos más vendidos por cantidad"
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-slate-400 animate-pulse">Cargando datos...</div>
      ) : data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-slate-400">No hay suficientes datos</div>
      ) : (
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            width={120}
            tick={{ fontSize: 11, fill: 'currentColor' }}
            className="text-muted-foreground"
          />
          <Tooltip 
            formatter={(value: number) => [`${value} unid.`, 'Vendidos']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'var(--color-card)', color: 'var(--color-foreground)' }}
            cursor={{ fill: 'var(--color-muted)' }}
          />
          <Bar 
            dataKey="count" 
            name="Vendidos"
            fill="var(--color-primary)" 
            radius={[0, 4, 4, 0]} 
            barSize={20}
          />
        </BarChart>
      )}
    </ChartCardWrapper>
  );
};
