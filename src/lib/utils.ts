import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function heatColor(value: number, max = 100): string {
  const ratio = Math.min(value / max, 1);
  if (ratio < 0.25) return '#1e3a5f';
  if (ratio < 0.5) return '#1d4ed8';
  if (ratio < 0.75) return '#7c3aed';
  if (ratio < 0.9) return '#db2777';
  return '#dc2626';
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400';
    case 'expiring': return 'bg-yellow-500/20 text-yellow-400';
    case 'expired': return 'bg-red-500/20 text-red-400';
    case 'draft': return 'bg-slate-500/20 text-slate-400';
    case 'disabled': return 'bg-red-500/20 text-red-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
}

export function riskColor(risk: string): string {
  switch (risk) {
    case 'high': return 'text-red-400';
    case 'medium': return 'text-yellow-400';
    default: return 'text-green-400';
  }
}
