import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ children, variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50',
        {
          'bg-indigo-600 text-white hover:bg-indigo-500': variant === 'primary',
          'bg-slate-700 text-slate-200 hover:bg-slate-600': variant === 'secondary',
          'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50': variant === 'ghost',
          'bg-red-600/20 text-red-400 hover:bg-red-600/30': variant === 'danger',
          'px-2.5 py-1.5 text-xs': size === 'sm',
          'px-3.5 py-2 text-sm': size === 'md',
          'px-5 py-2.5 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
