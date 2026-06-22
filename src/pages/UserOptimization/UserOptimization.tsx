import { useState } from 'react';
import {
  Users, GitMerge, Scale, AlertTriangle, TrendingDown,
  ChevronDown, ChevronRight, Link2, ArrowUpRight, Info
} from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  users, crossSystemPersons, lawMeasurementSummary,
  totalLawSavings,
} from '../../data/mockData';
import { formatCurrency, riskColor } from '../../lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── helpers ──────────────────────────────────────────────────────────────────
const LICENSE_COLOR: Record<string, string> = {
  Developer: '#8b5cf6', Professional: '#6366f1', Core: '#06b6d4',
  Limited: '#f59e0b', ESS: '#64748b', Test: '#334155',
};

function riskBadge(r: string) {
  const map: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    high:     'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    medium:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low:      'bg-green-500/20 text-green-400 border border-green-500/30',
  };
  return map[r] ?? map.low;
}

function systemTypeBadge(t: string) {
  const map: Record<string, string> = {
    S4H: 'bg-indigo-500/20 text-indigo-400', ECC: 'bg-blue-500/20 text-blue-400',
    BW:  'bg-purple-500/20 text-purple-400', CRM: 'bg-cyan-500/20 text-cyan-400',
    GRC: 'bg-orange-500/20 text-orange-400', HR:  'bg-teal-500/20 text-teal-400',
    'NON-SAP': 'bg-slate-500/20 text-slate-400',
  };
  return map[t] ?? 'bg-slate-500/20 text-slate-400';
}

// ─── Tab 1 — Inactive / Over-licensed ────────────────────────────────────────
function InactiveTab() {
  const dormantUsers = users.filter(u => u.monthlyUsage < 10);
  const totalSavings = dormantUsers.length * 800 * 12;
  return (
    <div className="space-y-4">
      <Card className="border-yellow-500/30 bg-yellow-500/5 flex items-center gap-4 p-4">
        <AlertTriangle size={20} className="text-yellow-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-300">
            {dormantUsers.length} users have not logged in for 180+ days.
          </p>
          <p className="text-xs text-yellow-400/70 mt-0.5">
            Estimated annual savings if removed: <strong>{formatCurrency(totalSavings)}</strong>
          </p>
        </div>
        <Button size="sm" variant="secondary"><TrendingDown size={13} /> Run Cleanup</Button>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Dormant (180d)', value: users.filter(u => !u.lastLogin || new Date(u.lastLogin) < new Date('2026-01-01')).length, color: 'text-red-400' },
          { label: 'Low Usage (<10%)', value: dormantUsers.length, color: 'text-orange-400' },
          { label: 'Over-licensed', value: users.filter(u => u.monthlyUsage < 20 && u.licenseType === 'Professional').length, color: 'text-yellow-400' },
          { label: 'Savings Opp.', value: formatCurrency(totalSavings), color: 'text-green-400' },
        ].map(s => (
          <Card key={s.label} className="flex items-center justify-between">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimisation Candidates</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">Export</Button>
            <Button size="sm">Bulk Remediate</Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                <th className="pb-2 text-left pr-4">User</th>
                <th className="pb-2 text-left pr-4">Dept</th>
                <th className="pb-2 text-left pr-4">License</th>
                <th className="pb-2 text-left pr-4">Last Login</th>
                <th className="pb-2 text-left pr-4">Usage</th>
                <th className="pb-2 text-left pr-4">Risk</th>
                <th className="pb-2 text-left pr-4">Recommendation</th>
                <th className="pb-2 text-right">Saving/yr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {users.map(user => {
                const rec =
                  !user.lastLogin ? 'Remove License' :
                  user.monthlyUsage < 10 && user.licenseType === 'Professional' ? 'Downgrade to Limited' :
                  user.monthlyUsage < 30 ? 'Review Usage' : 'No Action';
                const saving = rec === 'Remove License' ? (user.licenseType === 'Developer' ? 1400 : 800) * 12
                  : rec === 'Downgrade to Limited' ? (800 - 300) * 12 : 0;
                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pr-4"><p className="font-medium text-slate-200">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></td>
                    <td className="py-3 pr-4 text-xs text-slate-300">{user.department}</td>
                    <td className="py-3 pr-4"><Badge className="bg-indigo-500/20 text-indigo-400 text-[10px]">{user.licenseType}</Badge></td>
                    <td className="py-3 pr-4 text-xs text-slate-400">{user.lastLogin ?? <span className="text-red-400">Never</span>}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-700/50 rounded-full h-1.5 w-16"><div className={`h-full rounded-full ${user.monthlyUsage < 20 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${user.monthlyUsage}%` }} /></div>
                        <span className="text-xs text-slate-400">{user.monthlyUsage}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4"><span className={`text-xs font-medium ${riskColor(user.risk)}`}>{user.risk.toUpperCase()}</span></td>
                    <td className="py-3 pr-4"><Badge className={rec === 'Remove License' ? 'bg-red-500/20 text-red-400' : rec === 'Downgrade to Limited' ? 'bg-yellow-500/20 text-yellow-400' : rec === 'Review Usage' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}>{rec}</Badge></td>
                    <td className="py-3 text-right text-xs font-medium">{saving > 0 ? <span className="text-green-400">{formatCurrency(saving)}</span> : <span className="text-slate-600">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Tab 2 — Duplicate User Analysis ─────────────────────────────────────────
function DuplicateTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const criticalHigh = crossSystemPersons.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high');

  return (
    <div className="space-y-4">
      {/* explainer */}
      <Card className="border-indigo-500/20 bg-indigo-500/5 flex gap-3 items-start p-4">
        <Info size={15} className="text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-indigo-300">Cross-system identity matching</strong> detects the same person using different User IDs across SAP landscapes
          (e.g. <code className="text-amber-400 bg-amber-400/10 px-1 rounded">vgupta</code> in S/4HANA vs
          <code className="text-amber-400 bg-amber-400/10 px-1 rounded mx-1">vineetg</code> in ECC).
          Matching uses employee ID, email domain, and name-similarity scoring.
          Unresolved duplicates inflate SAP LAW counts and cause unnecessary license uplifts.
        </p>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Duplicate Identities', value: crossSystemPersons.length, color: 'text-indigo-400' },
          { label: 'Critical / High Risk', value: criticalHigh.length, color: 'text-red-400' },
          { label: 'Systems Scanned', value: lawMeasurementSummary.length, color: 'text-blue-400' },
          { label: 'Annual Saving if Fixed', value: formatCurrency(totalLawSavings), color: 'text-green-400' },
        ].map(s => (
          <Card key={s.label} className="flex items-center justify-between">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detected Duplicate Identities</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">Run Scan</Button>
            <Button size="sm">Merge All High-Confidence</Button>
          </div>
        </CardHeader>
        <div className="space-y-2">
          {crossSystemPersons.map(person => {
            const isOpen = expanded === person.id;
            return (
              <div key={person.id} className="rounded-xl border border-slate-700/40 overflow-hidden">
                {/* Row header */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/60 transition-colors text-left"
                  onClick={() => setExpanded(isOpen ? null : person.id)}
                >
                  {isOpen ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}

                  {/* Name + dept */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-200 text-sm">{person.resolvedName}</span>
                      <span className="text-xs text-slate-500">{person.employeeId}</span>
                      <Badge className="text-[10px] bg-slate-700/50 text-slate-400">{person.department}</Badge>
                      <Badge className={`text-[10px] ${riskBadge(person.riskLevel)}`}>{person.riskLevel.toUpperCase()}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {person.accounts.map(a => (
                        <span key={a.systemId} className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Badge className={`text-[10px] ${systemTypeBadge(a.systemType)}`}>{a.systemType}</Badge>
                          <code className="text-amber-400">{a.userId}</code>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="text-right shrink-0 hidden md:block">
                    <p className="text-[10px] text-slate-500">Match confidence</p>
                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <div className="bg-slate-700/50 rounded-full h-1 w-16">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${person.matchConfidence}%` }} />
                      </div>
                      <span className="text-xs font-bold text-indigo-400">{person.matchConfidence}%</span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">{person.matchBasis.join(' · ')}</p>
                  </div>

                  {/* LAW impact */}
                  <div className="text-right shrink-0 hidden md:block">
                    <p className="text-[10px] text-slate-500">LAW License</p>
                    <Badge className={`text-[10px] mt-0.5 ${LICENSE_COLOR[person.lawLicense] ? `bg-[${LICENSE_COLOR[person.lawLicense]}]/20` : ''} bg-indigo-500/20 text-indigo-300`}>{person.lawLicense}</Badge>
                  </div>

                  {/* Saving */}
                  <div className="text-right shrink-0">
                    {person.annualSaving > 0
                      ? <span className="text-sm font-bold text-green-400">{formatCurrency(person.annualSaving)}/yr</span>
                      : <span className="text-xs text-slate-600">No saving</span>
                    }
                  </div>

                  <div className="flex gap-1.5 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="secondary">Review</Button>
                    {person.annualSaving > 0 && <Button size="sm">Fix</Button>}
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-4 pb-4 bg-slate-900/40 border-t border-slate-700/40">
                    <p className="text-xs text-slate-500 mt-3 mb-3 flex items-start gap-1.5">
                      <Link2 size={12} className="mt-0.5 shrink-0 text-indigo-400" />
                      {person.duplicateReason}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-700/50 text-slate-500 uppercase">
                            <th className="pb-2 text-left pr-3">System</th>
                            <th className="pb-2 text-left pr-3">User ID</th>
                            <th className="pb-2 text-left pr-3">License Type</th>
                            <th className="pb-2 text-left pr-3">Roles</th>
                            <th className="pb-2 text-left pr-3">Last Login</th>
                            <th className="pb-2 text-right">Annual Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/20">
                          {person.accounts.map(acc => {
                            const isLaw = acc.licenseTypeRank === Math.max(...person.accounts.map(x => x.licenseTypeRank));
                            return (
                              <tr key={acc.systemId} className={isLaw ? 'bg-red-500/5' : ''}>
                                <td className="py-2 pr-3">
                                  <div className="flex items-center gap-1.5">
                                    <Badge className={`text-[10px] ${systemTypeBadge(acc.systemType)}`}>{acc.systemType}</Badge>
                                    <span className="text-slate-300">{acc.systemName}</span>
                                    {isLaw && <Badge className="text-[10px] bg-red-500/20 text-red-400">LAW MAX</Badge>}
                                  </div>
                                </td>
                                <td className="py-2 pr-3"><code className="text-amber-400 bg-amber-400/10 px-1 rounded">{acc.userId}</code></td>
                                <td className="py-2 pr-3">
                                  <Badge className="text-[10px]" variant="outline">
                                    {acc.licenseType}
                                  </Badge>
                                </td>
                                <td className="py-2 pr-3">
                                  <div className="flex flex-wrap gap-1">
                                    {acc.roles.slice(0, 2).map(r => <code key={r} className="text-[10px] bg-slate-700/50 text-slate-400 px-1 rounded">{r}</code>)}
                                    {acc.roles.length > 2 && <span className="text-[10px] text-slate-600">+{acc.roles.length - 2}</span>}
                                  </div>
                                </td>
                                <td className="py-2 pr-3 text-slate-400">{acc.lastLogin ?? <span className="text-red-400">Never</span>}</td>
                                <td className="py-2 text-right font-medium text-slate-200">{formatCurrency(acc.annualCost)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {person.optimisedLicense && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                        <ArrowUpRight size={12} className="shrink-0" />
                        Consolidate to <strong>{person.optimisedLicense}</strong> across all systems → saves{' '}
                        <strong>{formatCurrency(person.annualSaving)}/yr</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── Tab 3 — SAP LAW Count ────────────────────────────────────────────────────
const LICENSE_TYPES = ['Professional', 'Developer', 'Limited', 'ESS', 'Test'] as const;

function LawTab() {
  const chartData = lawMeasurementSummary.map(s => ({
    name: s.systemId,
    Professional: s.professional,
    Developer: s.developer,
    Limited: s.limited,
    ESS: s.ess,
    Test: s.test,
  }));

  const totalByType = LICENSE_TYPES.reduce((acc, lt) => {
    acc[lt] = lawMeasurementSummary.reduce((s, sys) => s + (sys[lt.toLowerCase() as keyof typeof sys] as number), 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <Card className="border-indigo-500/20 bg-indigo-500/5 flex gap-3 items-start p-4">
        <Info size={15} className="text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-indigo-300">SAP LAW (License Administration Workbench)</strong> consolidates user counts across all connected systems.
          For each person, the <strong className="text-red-300">HIGHEST license type across all systems</strong> is used for the consolidated count.
          This means a user with <em>Limited</em> in 5 systems but <em>Professional</em> in just 1 system is counted as Professional in the LAW report.
          The table below shows the per-system breakdown; the "<em>LAW Uplift</em>" column shows where cross-system mismatches are inflating the consolidated count.
        </p>
      </Card>

      {/* Summary metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {LICENSE_TYPES.map(lt => (
          <Card key={lt} className="text-center">
            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: LICENSE_COLOR[lt] ?? '#475569' }} />
            <p className="text-xs text-slate-400 mb-1">{lt}</p>
            <p className="text-xl font-bold" style={{ color: LICENSE_COLOR[lt] ?? '#94a3b8' }}>{totalByType[lt]?.toLocaleString()}</p>
            <p className="text-[10px] text-slate-600 mt-1">across all systems</p>
          </Card>
        ))}
      </div>

      {/* Stacked bar per system */}
      <Card>
        <CardHeader>
          <CardTitle>License Distribution by System</CardTitle>
          <span className="text-xs text-slate-500">Used for LAW consolidated count</span>
        </CardHeader>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            {LICENSE_TYPES.map(lt => (
              <Bar key={lt} dataKey={lt} stackId="law" fill={LICENSE_COLOR[lt] ?? '#475569'}
                radius={lt === 'Professional' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Per-system table */}
      <Card>
        <CardHeader>
          <CardTitle>SAP LAW System Measurement Table</CardTitle>
          <Button size="sm" variant="secondary">Export LAW Report</Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                <th className="pb-2 text-left pr-4">System</th>
                <th className="pb-2 text-center pr-3">Type</th>
                <th className="pb-2 text-right pr-3">Total Users</th>
                <th className="pb-2 text-right pr-3 text-indigo-400">Professional</th>
                <th className="pb-2 text-right pr-3 text-purple-400">Developer</th>
                <th className="pb-2 text-right pr-3 text-amber-400">Limited</th>
                <th className="pb-2 text-right pr-3 text-slate-400">ESS</th>
                <th className="pb-2 text-right pr-3 text-slate-600">Test</th>
                <th className="pb-2 text-right">LAW FUE Contrib.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {lawMeasurementSummary.map(sys => (
                <tr key={sys.systemId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-slate-200">{sys.systemName}</p>
                    <p className="text-xs text-slate-500 font-mono">{sys.systemId}</p>
                  </td>
                  <td className="py-3 pr-3 text-center">
                    <Badge className={`text-[10px] ${systemTypeBadge(sys.systemType)}`}>{sys.systemType}</Badge>
                  </td>
                  <td className="py-3 pr-3 text-right tabular-nums text-slate-300">{sys.totalUsers.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-right tabular-nums font-medium text-indigo-400">{sys.professional.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-right tabular-nums font-medium text-purple-400">{sys.developer.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-right tabular-nums font-medium text-amber-400">{sys.limited.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-right tabular-nums text-slate-500">{sys.ess.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-right tabular-nums text-slate-600">{sys.test.toLocaleString()}</td>
                  <td className="py-3 text-right tabular-nums font-bold text-slate-200">{sys.lawContribution.toFixed(1)}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="border-t-2 border-slate-600 bg-slate-800/30">
                <td className="py-3 pr-4 font-bold text-slate-100" colSpan={2}>Consolidated LAW Total</td>
                <td className="py-3 pr-3 text-right font-bold text-slate-100 tabular-nums">{lawMeasurementSummary.reduce((s,r) => s + r.totalUsers, 0).toLocaleString()}</td>
                <td className="py-3 pr-3 text-right font-bold text-indigo-300 tabular-nums">{lawMeasurementSummary.reduce((s,r) => s + r.professional, 0).toLocaleString()}</td>
                <td className="py-3 pr-3 text-right font-bold text-purple-300 tabular-nums">{lawMeasurementSummary.reduce((s,r) => s + r.developer, 0).toLocaleString()}</td>
                <td className="py-3 pr-3 text-right font-bold text-amber-300 tabular-nums">{lawMeasurementSummary.reduce((s,r) => s + r.limited, 0).toLocaleString()}</td>
                <td className="py-3 pr-3 text-right font-bold text-slate-400 tabular-nums">{lawMeasurementSummary.reduce((s,r) => s + r.ess, 0).toLocaleString()}</td>
                <td className="py-3 pr-3 text-right font-bold text-slate-500 tabular-nums">{lawMeasurementSummary.reduce((s,r) => s + r.test, 0).toLocaleString()}</td>
                <td className="py-3 text-right font-bold text-white tabular-nums">{lawMeasurementSummary.reduce((s,r) => s + r.lawContribution, 0).toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LAW uplift persons */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <ArrowUpRight size={13} className="text-red-400" />
            Cross-system LAW uplifts — users whose highest license inflates the consolidated count
          </p>
          <div className="space-y-1.5">
            {crossSystemPersons.filter(p => p.annualSaving > 0).map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg bg-slate-900/50 px-3 py-2 text-xs">
                <span className="font-medium text-slate-200 w-36 shrink-0">{p.resolvedName}</span>
                <div className="flex items-center gap-1 flex-1 flex-wrap">
                  {p.accounts.map(a => {
                    const isMax = a.licenseTypeRank === Math.max(...p.accounts.map(x => x.licenseTypeRank));
                    return (
                      <span key={a.systemId} className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${isMax ? 'bg-red-500/15 border border-red-500/30' : 'bg-slate-800'}`}>
                        <Badge className={`text-[10px] ${systemTypeBadge(a.systemType)}`}>{a.systemId}</Badge>
                        <code className="text-amber-400">{a.userId}</code>
                        <span style={{ color: LICENSE_COLOR[a.licenseType] ?? '#94a3b8' }}>{a.licenseType}</span>
                        {isMax && <span className="text-red-400 font-bold">↑LAW</span>}
                      </span>
                    );
                  })}
                </div>
                <span className="text-green-400 font-semibold shrink-0">{formatCurrency(p.annualSaving)}/yr</span>
                <Button size="sm" variant="secondary">Fix</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'inactive',   label: 'Inactive & Over-licensed', icon: Users },
  { id: 'duplicates', label: 'Duplicate User Analysis',  icon: GitMerge },
  { id: 'law',        label: 'SAP LAW Count',            icon: Scale },
] as const;

export function UserOptimization() {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('inactive');

  return (
    <div>
      <Topbar title="User Optimization Center" subtitle="Inactive users · Cross-system duplicates · SAP LAW consolidation" />
      <div className="p-6 space-y-4">

        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-800/60 rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'inactive'   && <InactiveTab />}
        {tab === 'duplicates' && <DuplicateTab />}
        {tab === 'law'        && <LawTab />}
      </div>
    </div>
  );
}