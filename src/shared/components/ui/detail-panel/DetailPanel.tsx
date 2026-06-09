import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../sheet';

export interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-0 flex flex-col h-full bg-slate-50 border-l border-slate-200"
      >
        {title && (
          <SheetHeader className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
            <SheetTitle className="text-lg font-semibold text-slate-800">{title}</SheetTitle>
          </SheetHeader>
        )}
        
        {/* Contenedor principal con scroll interno */}
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};
