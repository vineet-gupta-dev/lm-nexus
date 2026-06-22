/**
 * Drill-down detail views for each Dashboard KPI tile.
 * Each export is a self-contained React component.
 */
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
} from 'recharts';
import { Badge } from './Badge';
import {
  kpiData, contracts, users, chargebackData,
  complianceAlerts, savingsHeatMap,
} from '../../data/mockData';
import { formatCurrency, formatPercent, severityColor, statusColor } from '../../lib/utils';
import { AlertTriangle, TrendingDown } from 'lucide-react';

const LICENSE_COLORS: Record<string, string> = {
  Professional: '#6366f1',
  Developer:    '#8b5cf6',
  Limited:      '#06b6d4',
  ESS:          '#10b981',
  Test:         '#475569',
};

// ─── Shared sub-components ─────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{children}</p>;
}

// ─── License breakdown data (derived from chargebackData) ────────────────────
const licenseTypeSummary = (() => {
  const totals: Record<string, number> = {};
  chargebackData.forEach(d => {
    Object.entries(d.licenseTypes).forEach(([type, count]) => {
      totals[type] = (totals[type] ?? 0) + count;
    });
  });
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
})();

const licenseByDept = chargebackData.map(d => ({
  dept: d.department,
  ...d.licenseTypes,
  total: d.licenseCount,
}));

// ─── 1. Total Licenses ────────────────────────────────────────────────────────
export function TotalLicensesDrillDown() {
  const grandTotal = licenseTypeSummary.reduce((s, r) => s + r.value, 0);
  return (
    <>
      <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Grand Total</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">{kpiData.totalLicenses.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Variance vs mock sum</p>
          <p className="text-sm text-slate-400">{grandTotal.toLocaleString()} allocated</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionTitle>By License Type</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={licenseTypeSummary} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                {licenseTypeSummary.map((_, i) => (
                  <Cell key={i} fill={LICENSE_COLORS[licenseTypeSummary[i].name] ?? '#475569'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => [(v ?? 0).toLocaleString(), 'Users']}
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <SectionTitle>License Type Breakdown</SectionTitle>
          {licenseTypeSummary.map(({ name, value }) => (
            <div key={name} className="flex items-center gap-2 py-1.5 border-b border-slate-700/30 last:border-0">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LICENSE_COLORS[name] ?? '#475569' }} />
              <span className="text-sm text-slate-300 flex-1">{name}</span>
              <span className="text-sm font-bold tabular-nums text-slate-200">{value.toLocaleString()}</span>
              <span className="text-xs text-slate-500 w-12 text-right">{formatPercent((value / grandTotal) * 100)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-600">
            <span className="text-sm font-bold text-slate-300">Total</span>
            <span className="text-sm font-bold text-slate-100">{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Licenses by Department</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={licenseByDept} margin={{ left: -10, right: 5, top: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            {Object.keys(LICENSE_COLORS).filter(k => licenseTypeSummary.some(l => l.name === k)).map(lt => (
              <Bar key={lt} dataKey={lt} stackId="a" fill={LICENSE_COLORS[lt]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <SectionTitle>Department Detail</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
              <th className="pb-2 text-left pr-3">Department</th>
              <th className="pb-2 text-right pr-3">Professional</th>
              <th className="pb-2 text-right pr-3">Developer</th>
              <th className="pb-2 text-right pr-3">Limited</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {chargebackData.map(d => (
              <tr key={d.department} className="hover:bg-slate-800/40">
                <td className="py-2 pr-3 font-medium text-slate-200">{d.department}</td>
                <td className="py-2 pr-3 text-right text-indigo-400 tabular-nums">{(d.licenseTypes['Professional'] ?? 0).toLocaleString()}</td>
                <td className="py-2 pr-3 text-right text-purple-400 tabular-nums">{(d.licenseTypes['Developer'] ?? 0).toLocaleString()}</td>
                <td className="py-2 pr-3 text-right text-cyan-400 tabular-nums">{(d.licenseTypes['Limited'] ?? 0).toLocaleString()}</td>
                <td className="py-2 text-right font-bold text-slate-200 tabular-nums">{d.licenseCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── 2. Consumed ──────────────────────────────────────────────────────────────
export function ConsumedDrillDown() {
  const utilPct = (kpiData.consumed / kpiData.totalLicenses) * 100;
  const consumedByType = licenseTypeSummary.map(({ name, value }) => ({
    name,
    assigned: value,
    consumed: Math.round(value * (0.65 + Math.random() * 0.3)),
  }));

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Assigned', value: kpiData.consumed.toLocaleString(), color: 'text-blue-400' },
          { label: 'Utilisation', value: formatPercent(utilPct), color: utilPct > 90 ? 'text-red-400' : 'text-green-400' },
          { label: 'Available', value: kpiData.available.toLocaleString(), color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3 text-center">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle>Assigned vs Active Usage by License Type</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={consumedByType} margin={{ left: -10, right: 5, top: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="assigned" name="Assigned" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="consumed" name="Actively Used" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <SectionTitle>Consumption by Department</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
              <th className="pb-2 text-left pr-3">Department</th>
              <th className="pb-2 text-right pr-3">Assigned</th>
              <th className="pb-2 text-right pr-3">Monthly Cost</th>
              <th className="pb-2 text-left pr-3 w-28">Utilisation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {chargebackData.map(d => {
              const util = 60 + Math.round((d.licenseCount / 520) * 35);
              return (
                <tr key={d.department} className="hover:bg-slate-800/40">
                  <td className="py-2.5 pr-3 font-medium text-slate-200">{d.department}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-slate-300">{d.licenseCount.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-slate-300">{formatCurrency(d.monthlyCost)}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700/50 rounded-full h-1.5">
                        <div className={`h-full rounded-full ${util > 90 ? 'bg-red-500' : util > 75 ? 'bg-yellow-500' : 'bg-indigo-500'}`} style={{ width: `${util}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 tabular-nums">{util}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <SectionTitle>Sample User Assignments</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
              <th className="pb-2 text-left pr-3">User</th>
              <th className="pb-2 text-left pr-3">License</th>
              <th className="pb-2 text-left pr-3">Dept</th>
              <th className="pb-2 text-right">Usage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/40">
                <td className="py-2 pr-3">
                  <p className="text-slate-200">{u.name}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </td>
                <td className="py-2 pr-3">
                  <Badge className="text-[10px]" variant="outline">
                    {u.licenseType}
                  </Badge>
                </td>
                <td className="py-2 pr-3 text-xs text-slate-400">{u.department}</td>
                <td className="py-2 text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className="bg-slate-700/50 rounded-full h-1 w-12">
                      <div className={`h-full rounded-full ${u.monthlyUsage < 20 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${u.monthlyUsage}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 tabular-nums">{u.monthlyUsage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── 3. Available ─────────────────────────────────────────────────────────────
export function AvailableDrillDown() {
  const availableByContract = contracts.map(c => ({
    name: c.product.replace('SAP ', '').replace(' Cloud', '').replace(' Enterprise', ''),
    available: c.licensesTotal - c.licensesUsed,
    total: c.licensesTotal,
    pct: Math.round(((c.licensesTotal - c.licensesUsed) / c.licensesTotal) * 100),
    vendor: c.vendor,
    endDate: c.endDate,
    status: c.status,
  }));

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Available Now', value: kpiData.available.toLocaleString(), color: 'text-green-400' },
          { label: 'Headroom %', value: formatPercent((kpiData.available / kpiData.totalLicenses) * 100), color: 'text-teal-400' },
          { label: 'Contracts', value: contracts.length, color: 'text-indigo-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3 text-center">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle>Available Licenses by Contract</SectionTitle>
        <div className="space-y-3">
          {availableByContract.map(c => (
            <div key={c.name} className="rounded-lg bg-slate-800/60 border border-slate-700/40 p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-slate-200">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.vendor} · Expires {c.endDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-400">{c.available.toLocaleString()}</span>
                  <p className="text-xs text-slate-500">of {c.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${100 - c.pct}%` }} />
                </div>
                <span className="text-xs text-slate-400">{c.pct}% free</span>
                <Badge className={statusColor(c.status) + ' text-[10px]'}>{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── 4. Compliance Score ─────────────────────────────────────────────────────
export function ComplianceDrillDown() {
  const categories = [
    { name: 'Contract', score: 82, fill: '#6366f1', issues: 3 },
    { name: 'User', score: 78, fill: '#8b5cf6', issues: 5 },
    { name: 'Role', score: 95, fill: '#06b6d4', issues: 1 },
    { name: 'Indirect', score: 61, fill: '#f59e0b', issues: 4 },
    { name: 'Indirect Access', score: 72, fill: '#ef4444', issues: 2 },
  ];

  return (
    <>
      <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Overall Compliance Score</p>
          <p className="text-4xl font-bold text-teal-400 mt-1">{kpiData.complianceScore}%</p>
          <p className="text-xs text-green-400 mt-1">↑ 3 pts since last month</p>
        </div>
        <ResponsiveContainer width={140} height={140}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="90%" data={categories} startAngle={180} endAngle={-180}>
            <RadialBar dataKey="score" cornerRadius={4} background={{ fill: '#1e293b' }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <SectionTitle>Score by Category</SectionTitle>
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">{cat.name}</span>
                <div className="flex items-center gap-2">
                  {cat.issues > 0 && <span className="text-xs text-orange-400">{cat.issues} open issue{cat.issues > 1 ? 's' : ''}</span>}
                  <span className="text-sm font-bold tabular-nums" style={{ color: cat.fill }}>{cat.score}%</span>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-full h-2">
                <div className="h-full rounded-full transition-all" style={{ width: `${cat.score}%`, background: cat.fill }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Active Compliance Alerts</SectionTitle>
        <div className="space-y-2">
          {complianceAlerts.map(alert => (
            <div key={alert.id} className={`rounded-lg border p-3 ${severityColor(alert.severity)}`}>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-sm font-semibold">{alert.title}</span>
                <Badge className={`text-[10px] border ${severityColor(alert.severity)}`}>{alert.severity}</Badge>
              </div>
              <p className="text-xs opacity-75">{alert.description}</p>
              <p className="text-[11px] opacity-50 mt-1">{alert.affectedUsers} affected · {alert.detectedAt}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Contract Compliance</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
              <th className="pb-2 text-left pr-3">Contract</th>
              <th className="pb-2 text-right pr-3">Utilisation</th>
              <th className="pb-2 text-right">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {contracts.map(c => (
              <tr key={c.id} className="hover:bg-slate-800/40">
                <td className="py-2 pr-3"><p className="text-slate-200">{c.product}</p><p className="text-[11px] text-slate-500">{c.vendor}</p></td>
                <td className="py-2 pr-3 text-right">
                  <span className="text-xs text-slate-300">{c.licensesUsed}/{c.licensesTotal}</span>
                  <span className={`text-xs ml-1 ${(c.licensesUsed / c.licensesTotal) > 0.9 ? 'text-red-400' : 'text-slate-500'}`}>
                    ({Math.round((c.licensesUsed / c.licensesTotal) * 100)}%)
                  </span>
                </td>
                <td className="py-2 text-right font-bold" style={{ color: c.complianceScore >= 80 ? '#4ade80' : c.complianceScore >= 60 ? '#facc15' : '#f87171' }}>
                  {c.complianceScore}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── 5. Potential Savings ─────────────────────────────────────────────────────
export function SavingsDrillDown() {
  const savingsByCategory = [
    { category: 'Dormant Users',      amount: 186000, count: 127, action: 'Remove licenses for users inactive >180d' },
    { category: 'Over-licensed',      amount: 134000, count: 89,  action: 'Downgrade Professional → Limited' },
    { category: 'Role Downgrade',     amount: 88000,  count: 62,  action: 'Replace high-cost roles with equivalents' },
    { category: 'FUE Optimisation',   amount: 54000,  count: 43,  action: 'Reduce FUE weight via license type change' },
    { category: 'Duplicate Users',    amount: 20000,  count: 6,   action: 'Consolidate cross-system identities' },
  ];
  const savingsByDept = savingsHeatMap.reduce<Record<string, number>>((acc, d) => {
    acc[d.y] = (acc[d.y] ?? 0) + d.value;
    return acc;
  }, {});
  const deptChartData = Object.entries(savingsByDept).map(([name, value]) => ({ name, value }));

  return (
    <>
      <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Total Potential Savings</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{formatCurrency(kpiData.potentialSavings)}</p>
          <p className="text-xs text-slate-500 mt-1">Annual, across all vendors & departments</p>
        </div>
        <TrendingDown size={36} className="text-yellow-400/30" />
      </div>

      <div>
        <SectionTitle>Savings by Category</SectionTitle>
        <div className="space-y-2">
          {savingsByCategory.map(s => (
            <div key={s.category} className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{s.category}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.action}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-base font-bold text-green-400">{formatCurrency(s.amount)}</p>
                  <p className="text-xs text-slate-500">{s.count} users</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="bg-slate-700/50 rounded-full h-1.5">
                  <div className="h-full rounded-full bg-green-500/70" style={{ width: `${(s.amount / kpiData.potentialSavings) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Savings by Opportunity Type (Across Departments)</SectionTitle>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={deptChartData} margin={{ left: -10, right: 5, top: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: any) => [formatCurrency(v ?? 0), 'Savings']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
            <Bar dataKey="value" name="Savings" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

// ─── 6. Expiring Contracts ────────────────────────────────────────────────────
export function ExpiringContractsDrillDown() {
  const expiring = contracts.filter(c => c.status === 'expiring' || c.status === 'expired');
  const totalAtRisk = expiring.reduce((s, c) => s + c.licensesTotal * c.costPerLicense, 0);

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Contracts Expiring', value: expiring.length, color: 'text-orange-400' },
          { label: 'Total Value at Risk', value: formatCurrency(totalAtRisk), color: 'text-red-400' },
          { label: 'Avg Days to Expiry', value: '62 days', color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3 text-center">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle>Contracts Requiring Action</SectionTitle>
        <div className="space-y-3">
          {expiring.map(c => {
            const expDate = new Date(c.endDate);
            const today = new Date('2026-06-18');
            const daysLeft = Math.round((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={c.id} className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-200">{c.product}</p>
                    <p className="text-xs text-slate-500">{c.vendor} · {c.licensesTotal.toLocaleString()} licenses</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${daysLeft < 60 ? 'text-red-400' : 'text-orange-400'}`}>{daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}</p>
                    <p className="text-xs text-slate-500">{c.endDate}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><p className="text-slate-500">Used</p><p className="font-semibold text-slate-300">{c.licensesUsed}/{c.licensesTotal}</p></div>
                  <div><p className="text-slate-500">Annual Value</p><p className="font-semibold text-slate-300">{formatCurrency(c.licensesTotal * c.costPerLicense)}</p></div>
                  <div><p className="text-slate-500">Compliance</p><p className={`font-semibold ${c.complianceScore >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{c.complianceScore}%</p></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">Initiate Renewal</button>
                  <button className="px-3 py-1.5 text-xs bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">View Contract</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionTitle>All Contracts Overview</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
              <th className="pb-2 text-left pr-3">Contract</th>
              <th className="pb-2 text-right pr-3">Expiry</th>
              <th className="pb-2 text-right pr-3">Value</th>
              <th className="pb-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {contracts.map(c => (
              <tr key={c.id} className="hover:bg-slate-800/40">
                <td className="py-2 pr-3"><p className="text-slate-200">{c.product}</p><p className="text-[11px] text-slate-500">{c.vendor}</p></td>
                <td className="py-2 pr-3 text-right text-xs text-slate-400">{c.endDate}</td>
                <td className="py-2 pr-3 text-right text-xs text-slate-300">{formatCurrency(c.licensesTotal * c.costPerLicense)}</td>
                <td className="py-2"><Badge className={`text-[10px] ${statusColor(c.status)}`}>{c.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── 7. High-Risk Users ───────────────────────────────────────────────────────
export function HighRiskUsersDrillDown() {
  const highRisk = users.filter(u => u.risk === 'high');
  const medRisk   = users.filter(u => u.risk === 'medium');

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Critical / High Risk', value: kpiData.highRiskUsers, color: 'text-red-400' },
          { label: 'Medium Risk', value: medRisk.length, color: 'text-yellow-400' },
          { label: 'Low Risk', value: users.filter(u => u.risk === 'low').length, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3 text-center">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle>High-Risk Users (Inactive &gt;180 days)</SectionTitle>
        <div className="space-y-2">
          {highRisk.map(u => (
            <div key={u.id} className="flex items-center gap-3 rounded-lg bg-red-500/5 border border-red-500/20 p-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-red-400">{u.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email} · {u.department}</p>
              </div>
              <div className="text-right shrink-0">
                <Badge className="bg-indigo-500/20 text-indigo-400 text-[10px]">{u.licenseType}</Badge>
                <p className="text-[11px] text-slate-500 mt-0.5">Last: {u.lastLogin ?? <span className="text-red-400">Never</span>}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500">Usage</p>
                <p className="text-sm font-bold text-red-400">{u.monthlyUsage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Medium Risk Users</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
              <th className="pb-2 text-left pr-3">User</th>
              <th className="pb-2 text-left pr-3">License</th>
              <th className="pb-2 text-left pr-3">Last Login</th>
              <th className="pb-2 text-right">Usage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {medRisk.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/40">
                <td className="py-2 pr-3"><p className="text-slate-200">{u.name}</p><p className="text-[11px] text-slate-500">{u.department}</p></td>
                <td className="py-2 pr-3"><Badge className="text-[10px] bg-indigo-500/20 text-indigo-400">{u.licenseType}</Badge></td>
                <td className="py-2 pr-3 text-xs text-slate-400">{u.lastLogin ?? 'Never'}</td>
                <td className="py-2 text-right text-xs text-yellow-400 font-bold">{u.monthlyUsage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── 8. Indirect Usage Risk ───────────────────────────────────────────────────
export function IndirectRiskDrillDown() {
  const indirectSystems = [
    { system: 'Salesforce CRM', type: 'REST API', accesses: 45200, classification: 'Unclassified', risk: 'critical', estimatedFue: 12.0 },
    { system: 'MuleSoft Integration', type: 'RFC/BAPI', accesses: 28400, classification: 'Interface', risk: 'high', estimatedFue: 8.5 },
    { system: 'Power BI Premium', type: 'OData', accesses: 62100, classification: 'Report Tool', risk: 'medium', estimatedFue: 0 },
    { system: 'Custom Java App', type: 'JCo', accesses: 9800, classification: 'Unclassified', risk: 'high', estimatedFue: 3.2 },
    { system: 'Boomi Connector', type: 'RFC', accesses: 15600, classification: 'Interface', risk: 'medium', estimatedFue: 4.1 },
    { system: 'ServiceNow Connector', type: 'REST API', accesses: 7200, classification: 'Interface', risk: 'low', estimatedFue: 0 },
  ];

  const riskColors: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <>
      <div className="rounded-xl bg-orange-500/5 border border-orange-500/20 p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-orange-300">SAP Indirect Access Risk</strong> occurs when third-party systems
          (CRM, integration tools, custom apps) access SAP data via APIs, RFCs, or BAPIs on behalf of end users.
          SAP may count each such user as requiring an SAP license. Unclassified integrations are the highest risk.
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Integrations Detected', value: indirectSystems.length, color: 'text-purple-400' },
          { label: 'Unclassified', value: indirectSystems.filter(s => s.classification === 'Unclassified').length, color: 'text-red-400' },
          { label: 'Total Est. FUE Risk', value: indirectSystems.reduce((s, r) => s + r.estimatedFue, 0).toFixed(1), color: 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3 text-center">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle>Indirect Access Systems</SectionTitle>
        <div className="space-y-2">
          {indirectSystems.map(s => (
            <div key={s.system} className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-3">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{s.system}</p>
                  <p className="text-xs text-slate-500">Access type: <code className="text-amber-400">{s.type}</code> · {s.accesses.toLocaleString()} calls/month</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Badge className={`text-[10px] border ${riskColors[s.risk]}`}>{s.risk}</Badge>
                  <Badge className={s.classification === 'Unclassified' ? 'bg-red-500/20 text-red-400 text-[10px]' : 'bg-slate-700/50 text-slate-400 text-[10px]'}>
                    {s.classification}
                  </Badge>
                </div>
              </div>
              {s.estimatedFue > 0 && (
                <p className="text-xs text-orange-400 mt-1">
                  ⚠ Estimated FUE exposure: <strong>{s.estimatedFue}</strong> FUE if audited
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
