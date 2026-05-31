import { type ReactNode } from 'react';

export function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
        <div className="flex-1 border-b border-slate-100 border-dashed" />
      </div>
      <div className="flex flex-col space-y-4">
        {children}
      </div>
    </div>
  );
}
