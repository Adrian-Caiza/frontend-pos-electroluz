import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCardWrapper } from '../../../../../shared/components/ui/charts/ChartCardWrapper';
import { ArrowUpRight } from 'lucide-react';

interface SalesCompositionChartProps {
  data: Array<{ name: string; value: number }>;
  isLoading?: boolean;
}

const COLORS = ['#9b8afb', '#b6e454', '#fab251', '#f37c87', '#f4a1cd', '#fbc958'];

export const SalesCompositionChart = ({ data, isLoading }: SalesCompositionChartProps) => {
  const headerRight = (
    <div className="flex items-center text-[13px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
      Ver Todos
      <ArrowUpRight className="w-4 h-4 ml-0.5" />
    </div>
  );

  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <ChartCardWrapper 
      title="Categorías Populares" 
      headerRight={headerRight}
      className="border-none shadow-md bg-card"
      disableResponsiveContainer={true}
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-muted-foreground animate-pulse">Cargando datos...</div>
      ) : data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">No hay suficientes datos</div>
      ) : (
        <div className="flex flex-col h-full w-full items-center justify-start pt-2 pb-1">
          {/* Top: Donut Chart */}
          <div className="relative w-[140px] h-[140px] shrink-0 mx-auto mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  cornerRadius={10}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ventas']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'var(--color-card)', color: 'var(--color-foreground)' }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-bold text-foreground">Todos los</span>
              <span className="text-[11px] font-bold text-foreground">Productos</span>
            </div>
          </div>

          {/* Bottom: Custom Legend */}
          <div className="flex flex-col gap-2 w-full px-2">
            {data.slice(0, 5).map((item, index) => {
              const percent = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
              return (
                <div key={index} className="flex items-center justify-between w-full group">
                  <div className="flex items-center flex-1 pr-4">
                    <div 
                      className="w-2 h-2 rounded-full mr-2.5 shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-foreground shrink-0">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ChartCardWrapper>
  );
};
