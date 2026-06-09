import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../card';
import { ResponsiveContainer } from 'recharts';
import type { ReactNode } from 'react';

interface ChartCardWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  minHeight?: number;
}

export const ChartCardWrapper = ({
  title,
  description,
  children,
  className = '',
  minHeight = 300,
}: ChartCardWrapperProps) => {
  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs text-slate-500">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 relative pb-6 pt-2">
        <div style={{ height: minHeight, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
