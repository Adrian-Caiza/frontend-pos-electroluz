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
  // Configuración visual basada en la variante (Soporte Light/Dark Mode)
  const variantConfig = {
    destructive: {
      icon: <AlertCircle className="h-8 w-8 text-rose-500 dark:text-rose-400" />,
      iconBg: 'bg-rose-100 dark:bg-rose-500/20',
      buttonClass: 'bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-600 dark:hover:bg-rose-700',
    },
    warning: {
      icon: <AlertTriangle className="h-8 w-8 text-amber-500 dark:text-amber-400" />,
      iconBg: 'bg-amber-100 dark:bg-amber-500/20',
      buttonClass: 'bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-700',
    },
    info: {
      icon: <Info className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
      buttonClass: 'bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700',
    },
    default: {
      icon: <HelpCircle className="h-8 w-8 text-slate-500 dark:text-slate-400" />,
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900',
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
        className="sm:max-w-[400px] overflow-hidden bg-white dark:bg-slate-950 p-8 shadow-2xl rounded-3xl border-0" 
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center">
          {/* Ícono dinámico y centrado */}
          <div className={cn('flex h-20 w-20 shrink-0 items-center justify-center rounded-full mb-6', currentConfig.iconBg)}>
            {currentConfig.icon}
          </div>

          <DialogHeader className="text-center w-full">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white w-full flex justify-center">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-3 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 w-full flex justify-center text-center max-w-[280px] mx-auto">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="mt-8 m-0 border-t-0 p-0 bg-transparent flex flex-row gap-3 w-full sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-white dark:bg-transparent h-12 text-[15px] font-medium rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors m-0"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 h-12 text-[15px] font-medium rounded-xl shadow-none transition-colors m-0",
              currentConfig.buttonClass
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
