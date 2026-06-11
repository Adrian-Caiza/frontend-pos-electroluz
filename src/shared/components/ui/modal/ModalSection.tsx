import { type ReactNode } from 'react';

export function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-3">
        <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest">{title}</h3>
        <div className="flex-1 border-b border-border border-dashed" />
      </div>
      <div className="bg-muted/50 border border-border shadow-sm rounded-xl p-5">
        <div className="flex flex-col space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
}
