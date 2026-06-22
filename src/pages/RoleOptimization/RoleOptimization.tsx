import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { roles } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const radarData = roles.slice(0, 6).map(r => ({
  role: r.name.replace('SAP_', ''),
  usage: r.avgMonthlyUsage,
  users: Math.min(r.userCount / 5, 100),
  cost: Math.min((r.costPerUser / 14), 100),
}));

export function RoleOptimization() {
  return (
    <div>
      <Topbar title="Role Optimization Center" subtitle="Identify inefficient role assignments and consolidation opportunities" />
      <div className="p-6 space-y-4">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Role radar */}
          <Card>
            <CardHeader><CardTitle>Role Usage Radar</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="role" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Usage" dataKey="usage" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Radar name="Users" dataKey="users" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Role table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Role Utilization Analysis</CardTitle>
              <Button size="sm">Consolidate Selected</Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                    <th className="pb-2 text-left pr-4">Role</th>
                    <th className="pb-2 text-left pr-4">Category</th>
                    <th className="pb-2 text-right pr-4">Users</th>
                    <th className="pb-2 text-right pr-4">Avg Usage</th>
                    <th className="pb-2 text-right pr-4">Cost/User</th>
                    <th className="pb-2 text-right pr-4">Annual Cost</th>
                    <th className="pb-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {roles.map(role => {
                    const efficiency = role.avgMonthlyUsage;
                    const label = efficiency > 70 ? 'optimal' : efficiency > 40 ? 'review' : 'underutilized';
                    return (
                      <tr key={role.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-slate-200 text-xs font-mono">{role.name}</p>
                          <p className="text-[11px] text-slate-500">{role.description}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className="bg-slate-700/50 text-slate-400 text-[10px]">{role.category}</Badge>
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-slate-300 text-xs">{role.userCount}</td>
                        <td className="py-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="bg-slate-700/50 rounded-full h-1.5 w-12">
                              <div className={`h-full rounded-full ${efficiency > 70 ? 'bg-green-500' : efficiency > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${efficiency}%` }} />
                            </div>
                            <span className="text-xs text-slate-400">{efficiency}%</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-right text-xs text-slate-300">{formatCurrency(role.costPerUser)}</td>
                        <td className="py-3 pr-4 text-right text-xs font-medium text-slate-200">{formatCurrency(role.userCount * role.costPerUser * 12)}</td>
                        <td className="py-3">
                          <Badge className={
                            label === 'optimal' ? 'bg-green-500/20 text-green-400' :
                            label === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }>{label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
