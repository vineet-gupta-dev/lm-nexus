import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { contracts } from '../../data/mockData';
import { formatCurrency, statusColor } from '../../lib/utils';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export function Contracts() {
  const chartData = contracts.map(c => ({
    name: c.product.replace('SAP ', '').replace(' Cloud', ''),
    used: c.licensesUsed,
    total: c.licensesTotal,
    utilization: Math.round((c.licensesUsed / c.licensesTotal) * 100),
  }));

  return (
    <div>
      <Topbar title="Contract Management" subtitle="Monitor software license contracts, expiry, and compliance" />
      <div className="p-6 space-y-4">

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Active Contracts', value: contracts.filter(c => c.status === 'active').length, color: 'text-green-400' },
            { label: 'Expiring (90d)', value: contracts.filter(c => c.status === 'expiring').length, color: 'text-yellow-400' },
            { label: 'Total Annual Spend', value: formatCurrency(contracts.reduce((s, c) => s + c.licensesTotal * c.costPerLicense, 0)), color: 'text-indigo-400' },
            { label: 'Avg Compliance', value: `${Math.round(contracts.reduce((s, c) => s + c.complianceScore, 0) / contracts.length)}%`, color: 'text-teal-400' },
          ].map(s => (
            <Card key={s.label} className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Contracts Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Contract Repository</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary"><RefreshCw size={12} /> Sync</Button>
                <Button size="sm"><PlusCircle size={12} /> Add Contract</Button>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                    <th className="pb-2 text-left pr-3">Vendor / Product</th>
                    <th className="pb-2 text-right pr-3">Licenses</th>
                    <th className="pb-2 text-right pr-3">Cost / Lic</th>
                    <th className="pb-2 text-right pr-3">Annual</th>
                    <th className="pb-2 text-left pr-3">Expiry</th>
                    <th className="pb-2 text-left pr-3">Status</th>
                    <th className="pb-2 text-right">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {contracts.map(c => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pr-3">
                        <p className="font-medium text-slate-200 text-xs">{c.product}</p>
                        <p className="text-[11px] text-slate-500">{c.vendor}</p>
                      </td>
                      <td className="py-3 pr-3 text-right text-xs">
                        <span className="text-slate-200 font-medium">{c.licensesUsed}</span>
                        <span className="text-slate-500"> / {c.licensesTotal}</span>
                      </td>
                      <td className="py-3 pr-3 text-right text-xs text-slate-300">{formatCurrency(c.costPerLicense)}</td>
                      <td className="py-3 pr-3 text-right text-xs text-slate-200 font-medium">{formatCurrency(c.licensesTotal * c.costPerLicense)}</td>
                      <td className="py-3 pr-3 text-xs text-slate-400">{c.endDate}</td>
                      <td className="py-3 pr-3">
                        <Badge className={statusColor(c.status)}>{c.status}</Badge>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-xs font-bold ${c.complianceScore >= 80 ? 'text-green-400' : c.complianceScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {c.complianceScore}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Utilization Chart */}
          <Card>
            <CardHeader><CardTitle>License Utilization</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, 'Utilization']}
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.utilization > 90 ? '#ef4444' : entry.utilization > 70 ? '#f59e0b' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
