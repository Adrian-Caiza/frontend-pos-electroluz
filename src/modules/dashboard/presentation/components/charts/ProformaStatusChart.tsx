import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartCardWrapper } from '../../../../../shared/components/ui/charts/ChartCardWrapper';

interface ProformaStatusChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
  isLoading?: boolean;
}

export const ProformaStatusChart = ({ data, isLoading }: ProformaStatusChartProps) => {
  return (
    <ChartCardWrapper 
      title="Estado de Caja" 
      description="Proformas según su estado de pago"
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-slate-400 animate-pulse">Cargando datos...</div>
      ) : data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-slate-400">No hay suficientes datos</div>
      ) : (
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-slate-100)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--color-slate-600)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--color-slate-500)' }} 
          />
          <Tooltip 
            cursor={{ fill: 'var(--muted)' }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border border-border p-3 rounded-lg shadow-md">
                    <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: <span className="font-semibold text-foreground">{payload[0].value} proformas</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="value" 
            name="Proformas"
            radius={[4, 4, 0, 0]} 
            barSize={40}
          />
        </BarChart>
      )}
    </ChartCardWrapper>
  );
};
