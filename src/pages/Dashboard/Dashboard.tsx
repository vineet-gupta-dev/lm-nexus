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
  savingsHeatMap, usageTrend, complianceAlerts,
} from '../../data/mockData';
import { formatCurrency, severityColor } from '../../lib/utils';

type DrillKey =
  | 'total' | 'consumed' | 'available' | 'compliance'
  | 'savings' | 'expiring' | 'highrisk' | 'indirect'
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

export function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [drill, setDrill] = useState<DrillKey>(null);

  const open  = (key: Exclude<DrillKey, null>) => setDrill(key);
  const close = () => setDrill(null);

  const panelCfg = drill ? PANEL_CONFIG[drill] : null;

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
          {activeTab === 0 && (<div><p className="text-xs text-slate-500 mb-4">License utilization percentage by department & license type</p><HeatMap data={consumptionHeatMap} maxValue={100} formatValue={(v) => `${v}%`} /></div>)}
          {activeTab === 1 && (<div><p className="text-xs text-slate-500 mb-4">Monthly spend allocation by department (USD)</p><HeatMap data={costHeatMap} formatValue={(v) => `$${(v / 1000).toFixed(0)}k`} /></div>)}
          {activeTab === 2 && (<div><p className="text-xs text-slate-500 mb-4">Estimated annual savings by department & opportunity type (USD)</p><HeatMap data={savingsHeatMap} formatValue={(v) => `$${(v / 1000).toFixed(0)}k`} /></div>)}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Usage Trend */}
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>License Usage Trends</CardTitle><span className="text-xs text-slate-500">Last 6 months</span></CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={usageTrend} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
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
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <span className="text-xs text-red-400 font-medium">{complianceAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} critical</span>
            </CardHeader>
            <div className="space-y-2">
              {complianceAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-700/30">
                  <Zap size={12} className={`mt-0.5 shrink-0 ${alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-medium text-slate-200 leading-tight">{alert.title}</p>
                      <Badge className={severityColor(alert.severity)} variant="outline">{alert.severity}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Drill-Down Panel */}
      {panelCfg && (
        <DrillDownPanel open={drill !== null} title={panelCfg.title} subtitle={panelCfg.subtitle} onClose={close} width={panelCfg.width}>
          {drill === 'total'      && <TotalLicensesDrillDown />}
          {drill === 'consumed'   && <ConsumedDrillDown />}
          {drill === 'available'  && <AvailableDrillDown />}
          {drill === 'compliance' && <ComplianceDrillDown />}
          {drill === 'savings'    && <SavingsDrillDown />}
          {drill === 'expiring'   && <ExpiringContractsDrillDown />}
          {drill === 'highrisk'   && <HighRiskUsersDrillDown />}
          {drill === 'indirect'   && <IndirectRiskDrillDown />}
        </DrillDownPanel>
      )}
    </div>
  );
}