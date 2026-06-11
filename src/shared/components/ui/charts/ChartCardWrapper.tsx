import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../card';
import { ResponsiveContainer } from 'recharts';
import type { ReactNode } from 'react';

interface ChartCardWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  minHeight?: number;
  headerRight?: ReactNode;
  disableResponsiveContainer?: boolean;
}

export const ChartCardWrapper = ({
  title,
  description,
  children,
  className = '',
  minHeight = 300,
  headerRight,
  disableResponsiveContainer = false,
}: ChartCardWrapperProps) => {
  return (
    <Card className={`flex flex-col h-full border-border shadow-sm ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {headerRight && (
          <div className="flex-shrink-0">
            {headerRight}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 relative pb-6 pt-2">
        <div style={{ height: minHeight, width: '100%' }}>
          {disableResponsiveContainer ? (
            children
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {children as React.ReactElement}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
