import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCardWrapper } from '../../../../../shared/components/ui/charts/ChartCardWrapper';
import { ChevronDown } from 'lucide-react';

interface SalesTrendChartProps {
  data: Array<{ date: string; total: number; rawDate: string }>;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg border-none min-w-[120px] relative">
        <p className="text-xs font-medium opacity-80 mb-2">{label}</p>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground"></div>
          <span className="text-xs font-medium opacity-90">Ingresos</span>
        </div>
        <p className="text-lg font-bold">${payload[0].value.toFixed(2)}</p>
        {/* Triangle pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45"></div>
      </div>
    );
  }
  return null;
};

export const SalesTrendChart = ({ data, isLoading }: SalesTrendChartProps) => {
  const headerRight = (
    <div className="flex items-center text-sm text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors">
      Mensual
      <ChevronDown className="w-4 h-4 ml-1" />
    </div>
  );

  return (
    <ChartCardWrapper 
      title="Reporte de Ventas" 
      headerRight={headerRight}
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-muted-foreground animate-pulse">Cargando datos...</div>
      ) : data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">No hay suficientes datos</div>
      ) : (
        <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border opacity-50" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'currentColor' }} 
            className="text-muted-foreground"
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-muted-foreground"
            tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
            dx={-10}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'currentColor', className: 'text-border opacity-50', strokeWidth: 1, strokeDasharray: '3 3' }} 
          />
          <Area 
            type="monotone" 
            name="Ingresos"
            dataKey="total" 
            stroke="var(--color-primary)" 
            fillOpacity={1} 
            fill="url(#colorTotal)"
            strokeWidth={3}
            activeDot={{ r: 6, strokeWidth: 4, stroke: 'var(--color-background)', fill: 'var(--color-primary)' }}
          />
        </AreaChart>
      )}
    </ChartCardWrapper>
  );
};
