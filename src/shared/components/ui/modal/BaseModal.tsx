import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  hideCloseButton?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  hideCloseButton = false,
  footer,
  children
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={handleBackdropClick}>
      <div 
        ref={modalRef} 
        className={cn(
          "bg-white rounded-[20px] shadow-2xl flex flex-col max-h-[90vh] w-full animate-in zoom-in-95 duration-200",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {!hideCloseButton && (
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex flex-col space-y-6">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[20px] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
