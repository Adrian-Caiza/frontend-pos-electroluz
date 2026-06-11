import { type ReactNode } from 'react';
import { cn } from '../../../lib/utils';

interface ModalEntityCardProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  iconClassName?: string;
}

export function ModalEntityCard({ icon: Icon, title, subtitle, badges, iconClassName }: ModalEntityCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-muted border border-border rounded-xl space-y-3 sm:space-y-0 sm:space-x-4">
      <div className={cn("flex items-center justify-center w-12 h-12 rounded-lg bg-card shadow-sm border border-border text-indigo-600 dark:text-indigo-400 shrink-0", iconClassName)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col flex-1">
        <h4 className="text-base font-semibold text-foreground">{title}</h4>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {badges && (
        <div className="flex flex-wrap gap-2 shrink-0">
          {badges}
        </div>
      )}
    </div>
  );
}
