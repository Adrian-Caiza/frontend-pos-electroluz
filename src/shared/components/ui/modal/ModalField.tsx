import { type ReactNode } from 'react';

export function ModalField({ label, children, error, required }: { label: string; children: ReactNode; error?: string; required?: boolean }) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
