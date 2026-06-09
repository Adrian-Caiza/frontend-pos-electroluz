import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartCardWrapper } from '../../../../../shared/components/ui/charts/ChartCardWrapper';

interface SalesCompositionChartProps {
  data: Array<{ name: string; value: number }>;
  isLoading?: boolean;
}

const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];

export const SalesCompositionChart = ({ data, isLoading }: SalesCompositionChartProps) => {
  return (
    <ChartCardWrapper 
      title="Ventas por Categoría" 
      description="Distribución de ingresos según el tipo de producto"
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-slate-400 animate-pulse">Cargando datos...</div>
      ) : data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-slate-400">No hay suficientes datos</div>
      ) : (
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ventas']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
        </PieChart>
      )}
    </ChartCardWrapper>
  );
};
