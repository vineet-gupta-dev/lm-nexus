import { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, Cell
} from 'recharts';
import { Info, TrendingDown, AlertTriangle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { KpiCard } from '../../components/ui/KpiCard';
import {
  fueSummary, fueWeights, fueDepartmentData,
  fueRecommendations, fueTrend, fueWeightMap,
} from '../../data/mockData';
import { formatCurrency, formatNumber } from '../../lib/utils';

// ─── FUE colour scale ──────────────────────────────────────────────────────
function fueRatioColor(ratio: number) {
  if (ratio >= 0.98) return 'text-red-400';
  if (ratio >= 0.90) return 'text-orange-400';
  if (ratio >= 0.75) return 'text-yellow-400';
  return 'text-green-400';
}

function fueBarColor(ratio: number) {
  if (ratio >= 0.98) return '#ef4444';
  if (ratio >= 0.90) return '#f97316';
  if (ratio >= 0.75) return '#eab308';
  return '#22c55e';
}

const WEIGHT_COLORS: Record<string, string> = {
  Professional: '#6366f1',
  Developer:    '#8b5cf6',
  Advanced:     '#06b6d4',
  Core:         '#10b981',
  Limited:      '#f59e0b',
  ESS:          '#64748b',
  Test:         '#334155',
};

// Stack data for department chart
const deptChartData = fueDepartmentData.map(d => ({
  dept: d.department,
  Professional: +(d.professional * 1.00).toFixed(2),
  Developer:    +(d.developer    * 1.00).toFixed(2),
  Core:         0,
  Limited:      +(d.limited      * 0.33).toFixed(2),
  ESS:          +(d.ess          * 0.10).toFixed(2),
  Test:         +(d.test         * 0.01).toFixed(2),
  contracted:   d.contractedFue,
}));

export function FueLicensing() {
  const [simCount, setSimCount] = useState(100);
  const [simFrom, setSimFrom] = useState('Professional');
  const [simTo, setSimTo] = useState('Limited');

  const fromWeight = fueWeightMap[simFrom] ?? 1;
  const toWeight   = fueWeightMap[simTo]   ?? 0.33;
  const simFueSaving   = +(simCount * (fromWeight - toWeight)).toFixed(2);
  const simCostSaving  = simCount * ((fueWeights.find(w => w.licenseType === simFrom)?.monthlyFee ?? 0) - (fueWeights.find(w => w.licenseType === simTo)?.monthlyFee ?? 0)) * 12;

  const totalRecFueSaving  = fueRecommendations.reduce((s, r) => s + r.fueSaving, 0);
  const totalRecCostSaving = fueRecommendations.reduce((s, r) => s + r.annualCostSaving, 0);

  return (
    <div>
      <Topbar
        title="FUE Licensing"
        subtitle="SAP Full User Equivalent — consumption, compliance & optimisation"
      />
      <div className="p-6 space-y-5">

        {/* ── KPI Row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard
            title="FUE Contracted"
            value={formatNumber(fueSummary.contracted)}
            icon={<Info size={16} />}
            accent="indigo"
            delta="Annual cap from SAP contract"
            trend="neutral"
          />
          <KpiCard
            title="FUE Consumed"
            value={formatNumber(+fueSummary.consumed.toFixed(1))}
            icon={<Zap size={16} />}
            accent={fueSummary.consumed / fueSummary.contracted > 0.95 ? 'red' : 'blue'}
            delta={`${((fueSummary.consumed / fueSummary.contracted) * 100).toFixed(1)}% of cap`}
            trend="neutral"
          />
          <KpiCard
            title="FUE Headroom"
            value={+(fueSummary.contracted - fueSummary.consumed).toFixed(1)}
            icon={<CheckCircle2 size={16} />}
            accent="green"
            delta="Before audit threshold"
            trend="up"
          />
          <KpiCard
            title="Optimisable FUE"
            value={+fueSummary.savingsOpportunity.toFixed(1)}
            icon={<TrendingDown size={16} />}
            accent="yellow"
            delta={`≈ ${formatCurrency(totalRecCostSaving)} / yr savings`}
            trend="down"
          />
        </div>

        {/* ── Explainer banner ────────────────────────────────────────────── */}
        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <div className="flex gap-3 items-start">
            <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-indigo-300">How SAP FUE works:</strong>{' '}
              Each user's license type multiplied by its FUE weight counts towards your contracted cap.
              Exceeding the cap triggers a true-up audit. Downgrading high-weight users (Professional → Limited = <strong>−0.67 FUE</strong>)
              or converting inactive users to ESS (<strong>−0.90 FUE</strong> each) is the fastest way to reduce consumption
              and avoid audit risk without reducing headcount.
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ── FUE Weight Reference Table ─────────────────────────────────── */}
          <Card>
            <CardHeader><CardTitle>SAP FUE Weight Reference</CardTitle></CardHeader>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                  <th className="pb-2 text-left pr-3">License Type</th>
                  <th className="pb-2 text-left pr-3">SAP Category</th>
                  <th className="pb-2 text-center pr-3">FUE Weight</th>
                  <th className="pb-2 text-right">Monthly Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {fueWeights.map(w => (
                  <tr key={w.licenseType} className="hover:bg-slate-800/40">
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: WEIGHT_COLORS[w.licenseType] ?? '#475569' }} />
                        <span className="font-medium text-slate-200">{w.licenseType}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-xs text-slate-500">{w.sapCategory}</td>
                    <td className="py-2.5 pr-3 text-center">
                      <span className={`text-sm font-bold tabular-nums`}
                        style={{ color: WEIGHT_COLORS[w.licenseType] ?? '#94a3b8' }}>
                        {w.weight.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-xs text-slate-300 tabular-nums">
                      {formatCurrency(w.monthlyFee)}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-slate-600 mt-3">
              * Weights per SAP Global License Audit Methodology (GLAM). Verify against your contract schedule.
            </p>
          </Card>

          {/* ── FUE Trend Chart ────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>FUE Consumption Trend</CardTitle>
              <span className="text-xs text-slate-500">Last 6 months</span>
            </CardHeader>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={fueTrend} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gConsumed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="gOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[1100, 1600]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="contracted" name="Contracted Cap" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} />
                <Area  type="monotone" dataKey="consumed"   name="Actual FUE"    stroke="#6366f1" fill="url(#gConsumed)" strokeWidth={2} />
                <Area  type="monotone" dataKey="optimized"  name="Post-optimisation" stroke="#22c55e" fill="url(#gOpt)" strokeWidth={2} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── Department FUE Stack Chart ──────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>FUE Consumption by Department & License Type</CardTitle>
            <span className="text-xs text-slate-500">Stacked = actual FUE · Red line = contracted cap</span>
          </CardHeader>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={deptChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {['Professional', 'Developer', 'Limited', 'ESS', 'Test'].map(lt => (
                <Bar key={lt} dataKey={lt} stackId="fue" fill={WEIGHT_COLORS[lt] ?? '#475569'} radius={lt === 'Professional' ? [4,4,0,0] : [0,0,0,0]} />
              ))}
              <Line type="monotone" dataKey="contracted" name="Contracted Cap" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Department Table ───────────────────────────────────────────── */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Department FUE Breakdown</CardTitle>
              <Button size="sm" variant="secondary">Export</Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                    <th className="pb-2 text-left pr-3">Department</th>
                    <th className="pb-2 text-right pr-3">FUE Used</th>
                    <th className="pb-2 text-right pr-3">FUE Cap</th>
                    <th className="pb-2 text-left pr-3 w-32">Utilisation</th>
                    <th className="pb-2 text-right pr-3">Savings Opp.</th>
                    <th className="pb-2 text-left">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {fueDepartmentData.map(d => {
                    const ratio = d.totalFue / d.contractedFue;
                    return (
                      <tr key={d.department} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 pr-3 font-medium text-slate-200">{d.department}</td>
                        <td className="py-3 pr-3 text-right tabular-nums text-slate-300">{d.totalFue.toFixed(1)}</td>
                        <td className="py-3 pr-3 text-right tabular-nums text-slate-500">{d.contractedFue}</td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700/50 rounded-full h-1.5">
                              <div className="h-full rounded-full transition-all"
                                style={{ width: `${Math.min(ratio * 100, 100)}%`, background: fueBarColor(ratio) }} />
                            </div>
                            <span className={`text-xs tabular-nums font-semibold ${fueRatioColor(ratio)}`}>
                              {(ratio * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-right">
                          <span className="text-yellow-400 text-xs font-medium">−{d.savingsOpportunity.toFixed(1)} FUE</span>
                        </td>
                        <td className="py-3">
                          <Badge className={
                            ratio >= 0.98 ? 'bg-red-500/20 text-red-400' :
                            ratio >= 0.90 ? 'bg-orange-500/20 text-orange-400' :
                            ratio >= 0.75 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }>
                            {ratio >= 0.98 ? 'Critical' : ratio >= 0.90 ? 'High' : ratio >= 0.75 ? 'Medium' : 'OK'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ── What-if FUE Simulator ──────────────────────────────────────── */}
          <Card>
            <CardHeader><CardTitle>FUE What-If Simulator</CardTitle></CardHeader>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Number of Users</label>
                <input
                  type="number"
                  min={1} max={5000}
                  value={simCount}
                  onChange={e => setSimCount(+e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">From License</label>
                <select
                  value={simFrom}
                  onChange={e => setSimFrom(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {fueWeights.map(w => <option key={w.licenseType}>{w.licenseType}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">To License</label>
                <select
                  value={simTo}
                  onChange={e => setSimTo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {fueWeights.map(w => <option key={w.licenseType}>{w.licenseType}</option>)}
                </select>
              </div>

              {/* Result panel */}
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/50 p-3 mt-1 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{simFrom}</span>
                  <span className="text-slate-600">({fromWeight.toFixed(2)} FUE)</span>
                  <ArrowRight size={12} className="text-indigo-400" />
                  <span>{simTo}</span>
                  <span className="text-slate-600">({toWeight.toFixed(2)} FUE)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/50">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">FUE Freed</p>
                    <p className={`text-xl font-bold mt-0.5 ${simFueSaving > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {simFueSaving > 0 ? '−' : '+'}{Math.abs(simFueSaving).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Annual Saving</p>
                    <p className={`text-xl font-bold mt-0.5 ${simCostSaving > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {simCostSaving >= 0 ? '' : '-'}{formatCurrency(Math.abs(simCostSaving))}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600">
                  New FUE total ≈ {(fueSummary.consumed - (simFueSaving > 0 ? simFueSaving : 0)).toFixed(1)} of {fueSummary.contracted} cap
                </p>
              </div>
              <Button className="w-full justify-center" size="sm">
                <TrendingDown size={13} /> Apply Optimisation
              </Button>
            </div>
          </Card>
        </div>

        {/* ── AI Recommendations ─────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>FUE Reduction Recommendations</CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400 font-medium">
                −{totalRecFueSaving.toFixed(2)} FUE · {formatCurrency(totalRecCostSaving)}/yr
              </span>
              <Button size="sm">Apply All</Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                  <th className="pb-2 text-left pr-4">User</th>
                  <th className="pb-2 text-left pr-4">Dept</th>
                  <th className="pb-2 text-center pr-4">Current License</th>
                  <th className="pb-2 text-center pr-4">Recommended</th>
                  <th className="pb-2 text-center pr-4">FUE Saved</th>
                  <th className="pb-2 text-right pr-4">Annual Saving</th>
                  <th className="pb-2 text-center pr-4">Confidence</th>
                  <th className="pb-2 text-left pr-4">Reason</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {fueRecommendations.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-200">{rec.userName}</p>
                      <p className="text-xs text-slate-500">{rec.userId}</p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">{rec.department}</td>
                    <td className="py-3 pr-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <Badge className="bg-red-500/20 text-red-300 text-[10px]">{rec.currentLicense}</Badge>
                        <span className="text-[10px] text-slate-600">{rec.currentFue.toFixed(2)} FUE</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <Badge className="bg-green-500/20 text-green-300 text-[10px]">{rec.recommendedLicense}</Badge>
                        <span className="text-[10px] text-slate-600">{rec.recommendedFue.toFixed(2)} FUE</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="text-green-400 font-bold text-sm">−{rec.fueSaving.toFixed(2)}</span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="text-green-400 font-semibold text-xs">{formatCurrency(rec.annualCostSaving)}</span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="bg-slate-700/50 rounded-full h-1.5 w-16">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${rec.confidence}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400">{rec.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 max-w-xs">
                      <p className="text-xs text-slate-500 leading-relaxed">{rec.reason}</p>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary">Review</Button>
                        <Button size="sm">Apply</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit risk warning */}
          {fueSummary.complianceRisk > 0 && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle size={14} className="text-orange-400 mt-0.5 shrink-0" />
              <p className="text-xs text-orange-300">
                <strong>{fueSummary.complianceRisk} department{fueSummary.complianceRisk > 1 ? 's are' : ' is'} above 95% FUE utilisation</strong> — SAP
                audit triggers at 100%. Apply recommendations above to restore headroom before your next measurement date.
              </p>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
