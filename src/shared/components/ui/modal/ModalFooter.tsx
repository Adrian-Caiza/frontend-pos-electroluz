import { type ReactNode } from 'react';
import { Button } from '../button';
import { Loader2 } from 'lucide-react';

export interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  confirmVariant?: 'primary' | 'danger';
  children?: ReactNode; // For custom buttons if needed
}

export function ModalFooter({
  onCancel,
  onConfirm,
  cancelLabel = 'Cancelar',
  confirmLabel = 'Confirmar',
  isLoading = false,
  isDisabled = false,
  confirmVariant = 'primary',
  children
}: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end space-x-3 w-full">
      {children}
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
        className="rounded-xl px-6 font-medium text-slate-600 border-slate-200 hover:bg-slate-50"
      >
        {cancelLabel}
      </Button>
      <Button 
        type="button" 
        onClick={onConfirm}
        disabled={isDisabled || isLoading}
        className={`rounded-xl px-6 font-medium text-white shadow-md transition-all
          ${confirmVariant === 'primary' 
            ? 'bg-[#0d1b2a] hover:bg-[#1a2f4c] shadow-[#0d1b2a]/20' 
            : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {confirmLabel}
      </Button>
    </div>
  );
}
