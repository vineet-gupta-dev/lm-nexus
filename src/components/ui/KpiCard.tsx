import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  accent?: string;
  onClick?: () => void;
}

export function KpiCard({ title, value, delta, trend, icon, accent = 'indigo', onClick }: KpiCardProps) {
  const accentMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    green: 'bg-green-500/10 text-green-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    red: 'bg-red-500/10 text-red-400',
    purple: 'bg-purple-500/10 text-purple-400',
    blue: 'bg-blue-500/10 text-blue-400',
    teal: 'bg-teal-500/10 text-teal-400',
    orange: 'bg-orange-500/10 text-orange-400',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-slate-700/50 bg-slate-800/60 p-4 flex flex-col gap-3',
        onClick && 'cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/90 transition-all group'
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-tight">{title}</p>
        <div className="flex items-center gap-1.5">
          <div className={cn('p-2 rounded-lg', accentMap[accent] ?? accentMap['indigo'])}>
            {icon}
          </div>
          {onClick && <ChevronRight size={12} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100 tabular-nums">{value}</p>
        {delta && (
          <p className={cn('text-xs mt-1', trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400')}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'} {delta}
          </p>
        )}
      </div>
    </div>
  );
}
