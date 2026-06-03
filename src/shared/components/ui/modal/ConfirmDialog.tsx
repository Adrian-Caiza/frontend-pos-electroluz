import React, { type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, AlertCircle, Info, HelpCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'info' | 'default';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  // Configuración visual basada en la variante
  const variantConfig = {
    destructive: {
      icon: <AlertCircle className="h-6 w-6 text-red-600" />,
      iconBg: 'bg-red-100',
      buttonVariant: 'destructive' as const,
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      iconBg: 'bg-amber-100',
      buttonVariant: 'default' as const, // Puedes cambiar a un botón amarillo si existe
    },
    info: {
      icon: <Info className="h-6 w-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      buttonVariant: 'default' as const,
    },
    default: {
      icon: <HelpCircle className="h-6 w-6 text-slate-600" />,
      iconBg: 'bg-slate-100',
      buttonVariant: 'default' as const,
    },
  };

  const currentConfig = variantConfig[variant];

  // Para prevenir que al dar clic en cancelar se ejecute onConfirm u otra acción por propagación
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-[425px] overflow-hidden bg-white p-0 shadow-lg rounded-2xl" 
        showCloseButton={!isLoading}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Ícono dinámico */}
            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', currentConfig.iconBg)}>
              {currentConfig.icon}
            </div>

            <DialogHeader className="text-left">
              <DialogTitle className="text-lg font-bold text-slate-900">{title}</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-slate-500">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 px-6 py-4 sm:justify-end border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto bg-white"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={currentConfig.buttonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "w-full sm:w-auto",
              variant === 'warning' && "bg-amber-600 hover:bg-amber-700 text-white"
            )}
          >
            {isLoading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
