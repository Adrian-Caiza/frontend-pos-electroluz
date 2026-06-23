import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { X, ChevronDown, Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface SearchableOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  icon: React.ElementType<{ className?: string }>;
  placeholder: string;
  options: SearchableOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  renderOption?: (option: SearchableOption, isSelected: boolean) => ReactNode;
  emptyMessage?: string;
  onSearchChange?: (search: string) => void;
}

export function SearchableSelect({
  icon: Icon,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  renderOption,
  emptyMessage = 'Sin resultados',
  onSearchChange,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.id === value) || null;

  // Filter options based on search term
  const filtered = options.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.label.toLowerCase().includes(q) ||
      (o.sublabel && o.sublabel.toLowerCase().includes(q))
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      onChange(id);
      setIsOpen(false);
      setSearch('');
      if (onSearchChange) onSearchChange('');
    },
    [onChange, onSearchChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
      setSearch('');
      if (onSearchChange) onSearchChange('');
    },
    [onChange, onSearchChange],
  );

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
      if (onSearchChange) onSearchChange('');
      inputRef.current?.blur();
    }
  };

  // Display value: show selected option label when not searching
  const displayValue = isOpen ? search : selectedOption?.label || '';

  return (
    <div ref={containerRef} className="relative">
      {/* Input area */}
      <div
        className={cn(
          'relative flex items-center w-full h-10 rounded-lg border bg-background shadow-sm transition-all duration-200',
          disabled
            ? 'opacity-50 cursor-not-allowed border-border bg-input/50'
            : isOpen
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-muted-foreground/40',
        )}
      >
        <Icon
          className={cn(
            'absolute left-3 w-4 h-4 pointer-events-none transition-colors',
            isOpen ? 'text-primary' : 'text-muted-foreground',
          )}
        />
        <input
          ref={inputRef}
          type="text"
          className={cn(
            'w-full h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none',
            'pl-9 pr-16',
            disabled && 'cursor-not-allowed',
          )}
          placeholder={selectedOption && !isOpen ? selectedOption.label : placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
        />

        {/* Action buttons */}
        <div className="absolute right-2 flex items-center gap-0.5">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Limpiar selección"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                if (!isOpen) inputRef.current?.focus();
              }
            }}
            className={cn(
              'p-1 rounded-md text-muted-foreground transition-all',
              !disabled && 'hover:text-foreground hover:bg-muted',
            )}
            tabIndex={-1}
          >
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          className={cn(
            'absolute z-[150] w-full mt-1.5 py-1 rounded-xl border border-border bg-popover shadow-lg',
            'max-h-60 overflow-y-auto',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150',
          )}
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            filtered.map((option) => {
              const isSelected = option.id === value;

              if (renderOption) {
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 transition-colors',
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-accent',
                    )}
                  >
                    {renderOption(option, isSelected)}
                  </button>
                );
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                    isSelected
                      ? 'bg-primary/10'
                      : 'hover:bg-accent',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-sm font-medium truncate',
                        isSelected ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {option.label}
                    </div>
                    {option.sublabel && (
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {option.sublabel}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
