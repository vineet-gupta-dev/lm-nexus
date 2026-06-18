import { Bell, Search, User } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-slate-900/80 backdrop-blur border-b border-slate-700/50">
      <div>
        <h1 className="text-base font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search licenses, users, contracts…"
            className="pl-8 pr-4 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-64"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
            <User size={13} className="text-white" />
          </div>
          <span className="text-xs text-slate-300 hidden md:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
