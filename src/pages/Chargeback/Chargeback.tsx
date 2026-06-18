import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { chargebackData } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e'];

const pieData = chargebackData.map(c => ({ name: c.department, value: c.annualCost }));

export function Chargeback() {
  const totalAnnual = chargebackData.reduce((s, c) => s + c.annualCost, 0);

  return (
    <div>
      <Topbar title="Chargeback & Cost Allocation" subtitle="Allocate license costs by department, cost center, and region" />
      <div className="p-6 space-y-4">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pie */}
          <Card>
            <CardHeader><CardTitle>Cost Distribution</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), 'Annual Cost']}
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Bar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Annual Cost by Department</CardTitle>
              <Button size="sm" variant="secondary"><Download size={12} /> Export</Button>
            </CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chargebackData} margin={{ left: -10, right: 5, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), 'Annual Cost']}
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="annualCost" radius={[4, 4, 0, 0]}>
                  {chargebackData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed table */}
        <Card>
          <CardHeader>
            <CardTitle>Chargeback Report</CardTitle>
            <span className="text-sm font-bold text-indigo-400">Total: {formatCurrency(totalAnnual)}/yr</span>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                  <th className="pb-2 text-left pr-4">Department</th>
                  <th className="pb-2 text-left pr-4">Cost Center</th>
                  <th className="pb-2 text-left pr-4">Region</th>
                  <th className="pb-2 text-right pr-4">Licenses</th>
                  <th className="pb-2 text-right pr-4">Monthly</th>
                  <th className="pb-2 text-right pr-4">Annual</th>
                  <th className="pb-2 text-left">License Mix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {chargebackData.map(row => (
                  <tr key={row.department} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-200">{row.department}</td>
                    <td className="py-3 pr-4 text-xs text-slate-400 font-mono">{row.costCenter}</td>
                    <td className="py-3 pr-4 text-xs text-slate-400">{row.region}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-slate-300">{row.licenseCount.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-slate-300">{formatCurrency(row.monthlyCost)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums font-semibold text-slate-200">{formatCurrency(row.annualCost)}</td>
                    <td className="py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {Object.entries(row.licenseTypes).filter(([, v]) => v > 0).map(([type, count]) => (
                          <span key={type} className="text-[10px] bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded">
                            {type}: {count}
                          </span>
                        ))}
                      </div>
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
