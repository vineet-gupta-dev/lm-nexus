import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { complianceAlerts } from '../../data/mockData';
import { contracts } from '../../data/mockData';
import { severityColor, formatPercent } from '../../lib/utils';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const riskRadial = [
  { name: 'Contract', value: 72, fill: '#6366f1' },
  { name: 'User', value: 55, fill: '#8b5cf6' },
  { name: 'Role', value: 88, fill: '#06b6d4' },
  { name: 'Indirect', value: 40, fill: '#f59e0b' },
];

export function Compliance() {
  return (
    <div>
      <Topbar title="Compliance & Risk Center" subtitle="Continuous monitoring of license compliance and risk posture" />
      <div className="p-6 space-y-4">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Risk Score Visual */}
          <Card className="flex flex-col items-center">
            <CardHeader className="w-full"><CardTitle>Risk Scores by Category</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={riskRadial} startAngle={180} endAngle={-180}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#1e293b' }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              {riskRadial.map(r => (
                <div key={r.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.fill }} />
                  <span className="text-xs text-slate-400">{r.name}</span>
                  <span className="text-xs font-bold text-slate-200 ml-auto">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Compliance Alerts</CardTitle>
              <Button size="sm" variant="secondary">Acknowledge All</Button>
            </CardHeader>
            <div className="space-y-2">
              {complianceAlerts.map(alert => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${severityColor(alert.severity)}`}>
                  {alert.severity === 'critical' || alert.severity === 'high'
                    ? <ShieldAlert size={15} className="shrink-0 mt-0.5" />
                    : <ShieldCheck size={15} className="shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{alert.title}</p>
                      <Badge className={`${severityColor(alert.severity)} text-[10px]`} variant="outline">{alert.severity.toUpperCase()}</Badge>
                      <Badge className="bg-slate-700/50 text-slate-400 text-[10px]">{alert.category}</Badge>
                    </div>
                    <p className="text-xs opacity-80 mt-0.5">{alert.description}</p>
                    <p className="text-[11px] opacity-60 mt-1">Detected: {alert.detectedAt} · {alert.affectedUsers} affected</p>
                  </div>
                  <Button size="sm" variant="ghost" className="shrink-0">Resolve</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Contract Compliance table */}
        <Card>
          <CardHeader><CardTitle>Contract Compliance Status</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                  <th className="pb-2 text-left pr-4">Contract</th>
                  <th className="pb-2 text-right pr-4">Purchased</th>
                  <th className="pb-2 text-right pr-4">Used</th>
                  <th className="pb-2 text-right pr-4">Utilization</th>
                  <th className="pb-2 text-right">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {contracts.map(c => {
                  const util = (c.licensesUsed / c.licensesTotal) * 100;
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-slate-200 text-xs">{c.product}</p>
                        <p className="text-[11px] text-slate-500">{c.vendor}</p>
                      </td>
                      <td className="py-3 pr-4 text-right text-xs text-slate-300">{c.licensesTotal.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-right text-xs text-slate-300">{c.licensesUsed.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="bg-slate-700/50 rounded-full h-1.5 w-16">
                            <div className={`h-full rounded-full ${util > 90 ? 'bg-red-500' : util > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${util}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{formatPercent(util)}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-sm font-bold ${c.complianceScore >= 80 ? 'text-green-400' : c.complianceScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {c.complianceScore}%
                        </span>
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
  );
}
