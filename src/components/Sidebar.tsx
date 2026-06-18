import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Sliders, Users, FileText, TrendingDown,
  Repeat, ShieldCheck, FlaskConical, PieChart, GitBranch,
  ChevronRight, Scale
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Rule Engine', icon: Sliders, path: '/rules' },
  { label: 'Assignment Center', icon: Users, path: '/assignments' },
  { label: 'Contracts', icon: FileText, path: '/contracts' },
  { label: 'User Optimization', icon: TrendingDown, path: '/user-optimization' },
  { label: 'Role Optimization', icon: GitBranch, path: '/role-optimization' },
  { label: 'Role Replacement', icon: Repeat, path: '/role-replacement' },
  { label: 'Compliance & Risk', icon: ShieldCheck, path: '/compliance' },
  { label: 'Simulation', icon: FlaskConical, path: '/simulation' },
  { label: 'Chargeback', icon: PieChart, path: '/chargeback' },
  { label: 'FUE Licensing', icon: Scale, path: '/fue' },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-60 flex flex-col bg-slate-900 border-r border-slate-700/50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-700/50">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <ShieldCheck size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-100 leading-none">LM-Nexus</p>
          <p className="text-[10px] text-slate-500 mt-0.5">License Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Platform</p>
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors mb-0.5',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className={isActive ? 'text-indigo-400' : ''} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={12} className="text-indigo-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700/50">
        <p className="text-[10px] text-slate-600">© 2026 Pathlock · v2.0.0</p>
      </div>
    </aside>
  );
}
