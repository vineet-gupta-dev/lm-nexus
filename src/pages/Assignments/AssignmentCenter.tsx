import { useState } from 'react';
import { Search, UserPlus, UserMinus, RefreshCw, AlertTriangle } from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { users } from '../../data/mockData';
import { riskColor, statusColor } from '../../lib/utils';

export function AssignmentCenter() {
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.department.toLowerCase().includes(query.toLowerCase()) ||
    u.licenseType.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div>
      <Topbar title="License Assignment Center" subtitle="Assign, remove, and reclassify user licenses" />
      <div className="p-6 space-y-4">

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search users, departments, license types…"
              className="w-full pl-8 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
          {selectedIds.length > 0 && (
            <span className="text-xs text-indigo-400 font-medium">{selectedIds.length} selected</span>
          )}
          <Button size="sm"><UserPlus size={13} /> Assign License</Button>
          <Button size="sm" variant="secondary"><UserMinus size={13} /> Remove License</Button>
          <Button size="sm" variant="secondary"><RefreshCw size={13} /> Reclassify</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users & License Assignments</CardTitle>
            <span className="text-xs text-slate-500">{filtered.length} users</span>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                  <th className="pb-2 pr-3 w-8">
                    <input type="checkbox" className="accent-indigo-500 cursor-pointer" />
                  </th>
                  <th className="pb-2 text-left pr-4">User</th>
                  <th className="pb-2 text-left pr-4">Department</th>
                  <th className="pb-2 text-left pr-4">License Type</th>
                  <th className="pb-2 text-left pr-4">Roles</th>
                  <th className="pb-2 text-left pr-4">Last Login</th>
                  <th className="pb-2 text-left pr-4">Usage</th>
                  <th className="pb-2 text-left">Risk</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filtered.map((user) => (
                  <tr key={user.id} className={`hover:bg-slate-800/40 transition-colors ${selectedIds.includes(user.id) ? 'bg-indigo-500/5' : ''}`}>
                    <td className="py-3 pr-3">
                      <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggle(user.id)} className="accent-indigo-500 cursor-pointer" />
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-200">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-300 text-xs">{user.department}</td>
                    <td className="py-3 pr-4">
                      <Badge className={
                        user.licenseType === 'Developer' ? 'bg-purple-500/20 text-purple-400' :
                        user.licenseType === 'Professional' ? 'bg-indigo-500/20 text-indigo-400' :
                        'bg-slate-500/20 text-slate-400'
                      }>{user.licenseType}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.slice(0, 2).map(r => (
                          <code key={r} className="text-[10px] bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded">{r}</code>
                        ))}
                        {user.roles.length > 2 && (
                          <span className="text-[10px] text-slate-500">+{user.roles.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {user.lastLogin ?? <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={10} /> Never</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700/50 rounded-full h-1.5 w-16">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${user.monthlyUsage}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 tabular-nums">{user.monthlyUsage}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-medium ${riskColor(user.risk)}`}>{user.risk.toUpperCase()}</span>
                    </td>
                    <td className="py-3">
                      <Button size="sm" variant="ghost">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
