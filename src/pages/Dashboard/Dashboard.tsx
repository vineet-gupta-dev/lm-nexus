import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Package, Activity, CheckCircle2, DollarSign,
  AlertTriangle, Clock, Users, Zap,
} from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { KpiCard } from '../../components/ui/KpiCard';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { HeatMap } from '../../components/ui/HeatMap';
import { Badge } from '../../components/ui/Badge';
import { DrillDownPanel } from '../../components/ui/DrillDownPanel';
import {
  TotalLicensesDrillDown,
  ConsumedDrillDown,
  AvailableDrillDown,
  ComplianceDrillDown,
  SavingsDrillDown,
  ExpiringContractsDrillDown,
  HighRiskUsersDrillDown,
  IndirectRiskDrillDown,
} from '../../components/ui/DrillDownContent';
import {
  kpiData, consumptionHeatMap, costHeatMap,
  savingsHeatMap, usageTrend, complianceAlerts, users, chargebackData,
} from '../../data/mockData';
import { formatCurrency, severityColor } from '../../lib/utils';

type DrillKey =
  | 'total' | 'consumed' | 'available' | 'compliance'
  | 'savings' | 'expiring' | 'highrisk' | 'indirect'
  | null;

type UsageTrendPoint = (typeof usageTrend)[number];
type AlertPoint = (typeof complianceAlerts)[number];
type ContextDrill =
  | { type: 'heat-consumption'; cell: { x: string; y: string; value: number; label?: string } }
  | { type: 'heat-cost'; cell: { x: string; y: string; value: number; label?: string } }
  | { type: 'heat-savings'; cell: { x: string; y: string; value: number; label?: string } }
  | { type: 'trend'; point: UsageTrendPoint }
  | { type: 'alert'; alert: AlertPoint }
  | null;

const PANEL_CONFIG: Record<
  Exclude<DrillKey, null>,
  { title: string; subtitle: string; width: 'md' | 'lg' | 'xl' }
> = {
  total:      { title: 'Total Licenses — Breakdown', subtitle: 'All license types and department allocation', width: 'xl' },
  consumed:   { title: 'Consumed Licenses — Detail', subtitle: 'Active assignments, utilisation by department & user', width: 'xl' },
  available:  { title: 'Available Licenses', subtitle: 'Headroom per contract', width: 'lg' },
  compliance: { title: 'Compliance Score — Detail', subtitle: 'Category scores and open alerts', width: 'xl' },
  savings:    { title: 'Potential Savings — Breakdown', subtitle: 'Savings opportunities by category and department', width: 'xl' },
  expiring:   { title: 'Expiring Contracts', subtitle: 'Contracts requiring renewal action within 90 days', width: 'lg' },
  highrisk:   { title: 'High-Risk Users', subtitle: 'Inactive and over-licensed user accounts', width: 'lg' },
  indirect:   { title: 'Indirect Usage Risk', subtitle: '3rd-party integrations with SAP access', width: 'lg' },
};

const heatTabs = ['Consumption Heat Map', 'Cost Allocation', 'Savings Opportunities'];
const EMPTY_HEAT_CELL = { x: 'N/A', y: 'N/A', value: 0, label: '0' };

export function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [drill, setDrill] = useState<DrillKey>(null);
  const [contextDrill, setContextDrill] = useState<ContextDrill>(null);

  const open = (key: Exclude<DrillKey, null>) => {
    setContextDrill(null);
    setDrill(key);
  };
  const close = () => {
    setDrill(null);
    setContextDrill(null);
  };

  const panelCfg = drill ? PANEL_CONFIG[drill] : null;
  const contextPanelCfg = contextDrill
    ? contextDrill.type === 'heat-consumption'
      ? { title: `Consumption Detail — ${contextDrill.cell.x} / ${contextDrill.cell.y}`, subtitle: 'Department + license type utilisation', width: 'lg' as const }
      : contextDrill.type === 'heat-cost'
        ? { title: `Cost Detail — ${contextDrill.cell.y} (${contextDrill.cell.x})`, subtitle: 'Department monthly allocation breakdown', width: 'lg' as const }
        : contextDrill.type === 'heat-savings'
          ? { title: `Savings Detail — ${contextDrill.cell.x} / ${contextDrill.cell.y}`, subtitle: 'Opportunity value and related user risk', width: 'lg' as const }
          : contextDrill.type === 'trend'
            ? { title: `Usage Trend — ${contextDrill.point.month}`, subtitle: 'Month-wise license activity drill-down', width: 'lg' as const }
            : { title: `Alert Detail — ${contextDrill.alert.title}`, subtitle: 'Severity, impact, and recommended action', width: 'md' as const }
    : null;

  const activePanelCfg = panelCfg ?? contextPanelCfg;

  const trendDelta = (key: 'professional' | 'developer' | 'limited', month: string) => {
    const idx = usageTrend.findIndex((p) => p.month === month);
    if (idx <= 0) return null;
    return usageTrend[idx][key] - usageTrend[idx - 1][key];
  };

  const openConsumptionContext = () => {
    const cell = consumptionHeatMap[0] ?? EMPTY_HEAT_CELL;
    setActiveTab(0);
    setDrill(null);
    setContextDrill({ type: 'heat-consumption', cell });
  };

  const openCostContext = () => {
    const cell = costHeatMap[0] ?? EMPTY_HEAT_CELL;
    setActiveTab(1);
    setDrill(null);
    setContextDrill({ type: 'heat-cost', cell });
  };

  const openSavingsContext = () => {
    const cell = savingsHeatMap[0] ?? EMPTY_HEAT_CELL;
    setActiveTab(2);
    setDrill(null);
    setContextDrill({ type: 'heat-savings', cell });
  };

  const openTrendContext = () => {
    const point = usageTrend[usageTrend.length - 1] ?? usageTrend[0];
    if (!point) return;
    setDrill(null);
    setContextDrill({ type: 'trend', point });
  };

  const openAlertContext = () => {
    const alert = complianceAlerts[0];
    if (!alert) return;
    setDrill(null);
    setContextDrill({ type: 'alert', alert });
  };

  const contextLabel = contextDrill
    ? contextDrill.type === 'heat-consumption'
      ? `Consumption · ${contextDrill.cell.x} / ${contextDrill.cell.y}`
      : contextDrill.type === 'heat-cost'
        ? `Cost · ${contextDrill.cell.y} / ${contextDrill.cell.x}`
        : contextDrill.type === 'heat-savings'
          ? `Savings · ${contextDrill.cell.x} / ${contextDrill.cell.y}`
          : contextDrill.type === 'trend'
            ? `Trend · ${contextDrill.point.month}`
            : `Alert · ${contextDrill.alert.title}`
    : null;

  const renderContextDrill = () => {
    if (!contextDrill) return null;

    if (contextDrill.type === 'heat-consumption') {
      const { x: department, y: licenseType, value } = contextDrill.cell;
      const matchingUsers = users.filter((u) => u.department === department && u.licenseType === licenseType);

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Department</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{department}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">License Type</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{licenseType}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Utilisation</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{value}%</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sample Users In This Bucket</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {matchingUsers.length === 0 && <p className="text-sm text-slate-500">No sampled users for this department/license combination.</p>}
              {matchingUsers.map((u) => (
                <div key={u.id} className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200">{u.name}</p>
                    <Badge variant="outline" className={u.risk === 'high' ? 'text-red-300 border-red-500/40' : u.risk === 'medium' ? 'text-yellow-300 border-yellow-500/40' : 'text-green-300 border-green-500/40'}>{u.risk} risk</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{u.email}</p>
                  <p className="text-xs text-slate-400 mt-1">Monthly usage: {u.monthlyUsage}%</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (contextDrill.type === 'heat-cost') {
      const { x: month, y: department, value } = contextDrill.cell;
      const series = costHeatMap.filter((c) => c.y === department);
      const deptChargeback = chargebackData.find((d) => d.department === department);

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Month</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{month}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Department</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{department}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Monthly Cost</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{formatCurrency(value)}</p>
            </div>
          </div>

          {deptChargeback && (
            <div className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-3">
              <p className="text-xs text-slate-500">Chargeback Profile</p>
              <p className="text-sm text-slate-200 mt-1">Cost Center: {deptChargeback.costCenter} · Region: {deptChargeback.region}</p>
              <p className="text-sm text-slate-200">Annual Allocation: {formatCurrency(deptChargeback.annualCost)}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>6-Month Department Trend</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {series.map((point) => (
                <div key={`${point.x}-${point.y}`} className="flex items-center justify-between rounded-lg border border-slate-700/30 bg-slate-900/40 p-2.5">
                  <span className="text-sm text-slate-300">{point.x}</span>
                  <span className="text-sm font-semibold text-slate-100">{formatCurrency(point.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (contextDrill.type === 'heat-savings') {
      const { x: department, y: opportunity, value } = contextDrill.cell;
      const riskyUsers = users.filter((u) => u.department === department && (u.risk === 'high' || u.risk === 'medium'));

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Department</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{department}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Opportunity</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{opportunity}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Estimated Saving</p>
              <p className="text-sm font-semibold text-emerald-300 mt-1">{formatCurrency(value)}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Likely Affected Users</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {riskyUsers.length === 0 && <p className="text-sm text-slate-500">No medium/high-risk users in this department sample.</p>}
              {riskyUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border border-slate-700/30 bg-slate-900/40 p-2.5">
                  <div>
                    <p className="text-sm text-slate-200">{u.name}</p>
                    <p className="text-[11px] text-slate-500">{u.licenseType} · Usage {u.monthlyUsage}%</p>
                  </div>
                  <Badge variant="outline" className={u.risk === 'high' ? 'text-red-300 border-red-500/40' : 'text-yellow-300 border-yellow-500/40'}>{u.risk}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (contextDrill.type === 'trend') {
      const point = contextDrill.point;
      const proDelta = trendDelta('professional', point.month);
      const devDelta = trendDelta('developer', point.month);
      const limDelta = trendDelta('limited', point.month);

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Professional</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{point.professional.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 mt-1">{proDelta === null ? 'No previous month' : `${proDelta >= 0 ? '+' : ''}${proDelta} vs previous`}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Developer</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{point.developer.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 mt-1">{devDelta === null ? 'No previous month' : `${devDelta >= 0 ? '+' : ''}${devDelta} vs previous`}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-[11px] text-slate-500">Limited</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{point.limited.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 mt-1">{limDelta === null ? 'No previous month' : `${limDelta >= 0 ? '+' : ''}${limDelta} vs previous`}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-3">
            <p className="text-xs text-slate-500">Month total</p>
            <p className="text-base font-semibold text-slate-100 mt-1">{(point.professional + point.developer + point.limited + point.test).toLocaleString()} assigned licenses</p>
            <p className="text-xs text-slate-500 mt-1">Test users: {point.test.toLocaleString()}</p>
          </div>
        </div>
      );
    }

    const a = contextDrill.alert;
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-700/40 bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={severityColor(a.severity)} variant="outline">{a.severity}</Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">{a.category}</Badge>
            <span className="text-xs text-slate-500">Detected: {a.detectedAt}</span>
          </div>
          <p className="text-sm text-slate-200 mt-3">{a.description}</p>
          <p className="text-sm text-slate-300 mt-2">Affected users: <span className="font-semibold text-slate-100">{a.affectedUsers.toLocaleString()}</span></p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Action</CardTitle>
          </CardHeader>
          <div className="space-y-2 text-sm text-slate-300">
            <p>1. Validate impacted users and contracts for this alert category.</p>
            <p>2. Prioritize remediation based on severity and potential audit exposure.</p>
            <p>3. Track completion in Compliance & Risk module with ownership.</p>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <Topbar title="Executive Dashboard" subtitle="Real-time license intelligence · Click any tile to drill down" />
      <div className="p-6 space-y-6">

        {/* KPI Row — all tiles are now clickable */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          <KpiCard title="Total Licenses"    value={kpiData.totalLicenses.toLocaleString()} icon={<Package size={16} />}      accent="indigo"  delta="vs 4,600 last yr"    trend="up"      onClick={() => open('total')} />
          <KpiCard title="Consumed"          value={kpiData.consumed.toLocaleString()}      icon={<Activity size={16} />}      accent="blue"    delta={`${((kpiData.consumed / kpiData.totalLicenses) * 100).toFixed(0)}% utilization`} trend="neutral" onClick={() => open('consumed')} />
          <KpiCard title="Available"         value={kpiData.available.toLocaleString()}     icon={<CheckCircle2 size={16} />}  accent="green"   delta="28.75% headroom"     trend="up"      onClick={() => open('available')} />
          <KpiCard title="Compliance Score"  value={`${kpiData.complianceScore}%`}          icon={<CheckCircle2 size={16} />}  accent="teal"    delta="↑ 3pts this month"   trend="up"      onClick={() => open('compliance')} />
          <KpiCard title="Potential Savings" value={formatCurrency(kpiData.potentialSavings)} icon={<DollarSign size={16} />} accent="yellow"  delta="Across all vendors"  trend="neutral" onClick={() => open('savings')} />
          <KpiCard title="Expiring Contracts" value={kpiData.contractsNearExpiry}            icon={<Clock size={16} />}        accent="orange"  delta="Within 90 days"      trend="down"    onClick={() => open('expiring')} />
          <KpiCard title="High-Risk Users"   value={kpiData.highRiskUsers}                   icon={<Users size={16} />}        accent="red"     delta="Inactive >180 days"  trend="down"    onClick={() => open('highrisk')} />
          <KpiCard title="Indirect Risk"     value={kpiData.indirectUsageRisk}               icon={<AlertTriangle size={16} />} accent="purple" delta="3rd-party access"    trend="down"    onClick={() => open('indirect')} />
        </div>

        {/* Heat Map Section */}
        <Card>
          <CardHeader>
            <CardTitle>License Intelligence Heat Maps</CardTitle>
            <div className="flex gap-1">
              {heatTabs.map((t, i) => (
                <button key={t} onClick={() => setActiveTab(i)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === i ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </CardHeader>
          {activeTab === 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-4">License utilization percentage by department & license type · click a cell for detail</p>
              <HeatMap
                data={consumptionHeatMap}
                maxValue={100}
                formatValue={(v) => `${v}%`}
                onCellClick={(cell) => {
                  setDrill(null);
                  setContextDrill({ type: 'heat-consumption', cell });
                }}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <p className="text-xs text-slate-500 mb-4">Monthly spend allocation by department (USD) · click a cell for detail</p>
              <HeatMap
                data={costHeatMap}
                formatValue={(v) => `$${(v / 1000).toFixed(0)}k`}
                onCellClick={(cell) => {
                  setDrill(null);
                  setContextDrill({ type: 'heat-cost', cell });
                }}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <p className="text-xs text-slate-500 mb-4">Estimated annual savings by department & opportunity type (USD) · click a cell for detail</p>
              <HeatMap
                data={savingsHeatMap}
                formatValue={(v) => `$${(v / 1000).toFixed(0)}k`}
                onCellClick={(cell) => {
                  setDrill(null);
                  setContextDrill({ type: 'heat-savings', cell });
                }}
              />
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Usage Trend */}
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>License Usage Trends</CardTitle><span className="text-xs text-slate-500">Last 6 months</span></CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={usageTrend}
                margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                onClick={(state: any) => {
                  const payload = state?.activePayload?.[0]?.payload as UsageTrendPoint | undefined;
                  if (!payload?.month) return;
                  setDrill(null);
                  setContextDrill({ type: 'trend', point: payload });
                }}
              >
                <defs>
                  <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gDev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gLim" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#94a3b8' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
                <Area type="monotone" dataKey="professional" name="Professional" stroke="#6366f1" fill="url(#gPro)" strokeWidth={2} />
                <Area type="monotone" dataKey="developer" name="Developer" stroke="#8b5cf6" fill="url(#gDev)" strokeWidth={2} />
                <Area type="monotone" dataKey="limited" name="Limited" stroke="#06b6d4" fill="url(#gLim)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500 mr-1">Quick drill:</span>
              {usageTrend.map((point) => (
                <button
                  key={point.month}
                  onClick={() => {
                    setDrill(null);
                    setContextDrill({ type: 'trend', point });
                  }}
                  className="px-2 py-1 rounded border border-slate-600 text-xs text-slate-300 hover:border-indigo-500/50 hover:text-white"
                >
                  {point.month}
                </button>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <span className="text-xs text-red-400 font-medium">{complianceAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} critical</span>
            </CardHeader>
            <p className="text-[11px] text-slate-500 mb-2">Click any alert card to open full drill-down details.</p>
            <div className="space-y-2">
              {complianceAlerts.slice(0, 5).map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => {
                    setDrill(null);
                    setContextDrill({ type: 'alert', alert });
                  }}
                  className="w-full text-left flex items-start gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:border-indigo-500/40 hover:bg-slate-900/70 transition-colors"
                >
                  <Zap size={12} className={`mt-0.5 shrink-0 ${alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-medium text-slate-200 leading-tight">{alert.title}</p>
                      <Badge className={severityColor(alert.severity)} variant="outline">{alert.severity}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{alert.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Drill-Down Panel */}
      {activePanelCfg && (
        <DrillDownPanel open={drill !== null || contextDrill !== null} title={activePanelCfg.title} subtitle={activePanelCfg.subtitle} onClose={close} width={activePanelCfg.width}>
          {contextDrill && (
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 space-y-2">
              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                <button onClick={close} className="text-slate-400 hover:text-slate-200">Dashboard</button>
                <span className="text-slate-600">/</span>
                <span className="text-slate-300">Drill-down</span>
                <span className="text-slate-600">/</span>
                <span className="text-indigo-300 font-medium">{contextLabel}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={openConsumptionContext} className="px-2 py-1 rounded border border-slate-600 text-xs text-slate-300 hover:border-indigo-500/50 hover:text-white">Consumption</button>
                <button onClick={openCostContext} className="px-2 py-1 rounded border border-slate-600 text-xs text-slate-300 hover:border-indigo-500/50 hover:text-white">Cost</button>
                <button onClick={openSavingsContext} className="px-2 py-1 rounded border border-slate-600 text-xs text-slate-300 hover:border-indigo-500/50 hover:text-white">Savings</button>
                <button onClick={openTrendContext} className="px-2 py-1 rounded border border-slate-600 text-xs text-slate-300 hover:border-indigo-500/50 hover:text-white">Trend</button>
                <button onClick={openAlertContext} className="px-2 py-1 rounded border border-slate-600 text-xs text-slate-300 hover:border-indigo-500/50 hover:text-white">Alerts</button>
              </div>
            </div>
          )}
          {drill === 'total'      && <TotalLicensesDrillDown />}
          {drill === 'consumed'   && <ConsumedDrillDown />}
          {drill === 'available'  && <AvailableDrillDown />}
          {drill === 'compliance' && <ComplianceDrillDown />}
          {drill === 'savings'    && <SavingsDrillDown />}
          {drill === 'expiring'   && <ExpiringContractsDrillDown />}
          {drill === 'highrisk'   && <HighRiskUsersDrillDown />}
          {drill === 'indirect'   && <IndirectRiskDrillDown />}
          {renderContextDrill()}
        </DrillDownPanel>
      )}
    </div>
  );
}