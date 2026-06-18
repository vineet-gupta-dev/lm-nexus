import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DrillDownPanelProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | 'full';
}

export function DrillDownPanel({ open, title, subtitle, onClose, children, width = 'lg' }: DrillDownPanelProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex flex-col bg-slate-900 border-l border-slate-700/60 shadow-2xl transition-transform duration-300',
          width === 'full' && 'w-full',
          width === 'md' && 'w-full max-w-xl',
          width === 'lg' && 'w-full max-w-2xl',
          width === 'xl' && 'w-full max-w-4xl',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-700/60 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-100">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {children}
        </div>
      </div>
    </>
  );
}
