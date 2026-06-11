import { type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function ModalField({ label, children, error, required }: { label: string; children: ReactNode; error?: string; required?: boolean }) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className={cn("text-xs font-semibold", error ? "text-red-500" : "text-muted-foreground")}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {children}
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-red-500 animate-in fade-in zoom-in">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{error}</span>}
    </div>
  );
}
