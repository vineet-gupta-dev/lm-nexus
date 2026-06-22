import { useState } from 'react';
import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { simulationScenarios } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { FlaskConical, TrendingUp, TrendingDown, Plus } from 'lucide-react';

const scenarioTypes = [
  { type: 'add-users', label: 'Add Users', description: 'Simulate adding a new user group', icon: TrendingUp },
  { type: 'remove-users', label: 'Remove Users', description: 'Simulate removing dormant/exited users', icon: TrendingDown },
  { type: 'add-role', label: 'Add Role', description: 'Simulate assigning a new role broadly', icon: TrendingUp },
  { type: 'remove-role', label: 'Remove Role', description: 'Simulate revoking a role from users', icon: TrendingDown },
  { type: 'downgrade', label: 'Downgrade Licenses', description: 'Simulate downgrading license types', icon: TrendingDown },
];

export function Simulation() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div>
      <Topbar title="Simulation Engine" subtitle="Model license scenarios for planning, budgeting, and restructuring" />
      <div className="p-6 space-y-4">

        {/* Scenario type picker */}
        <Card>
          <CardHeader><CardTitle>Create New Simulation</CardTitle></CardHeader>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {scenarioTypes.map(({ type, label, description, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setSelectedType(t => t === type ? null : type)}
                className={`rounded-xl border p-3 text-left transition-all ${selectedType === type ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700/50 hover:border-indigo-500/40 hover:bg-slate-800/80'}`}
              >
                <Icon size={16} className={selectedType === type ? 'text-indigo-400' : 'text-slate-500'} />
                <p className="text-xs font-semibold text-slate-200 mt-2">{label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
              </button>
            ))}
          </div>

          {selectedType && (
            <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Scenario Name</label>
                <input className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="Scenario name…" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">User Count</label>
                <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" defaultValue={100} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">License Type</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option>Professional</option>
                  <option>Developer</option>
                  <option>Limited</option>
                  <option>Test</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full justify-center"><FlaskConical size={13} /> Run Simulation</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Saved scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Scenarios</CardTitle>
            <Button size="sm" variant="secondary"><Plus size={12} /> New</Button>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {simulationScenarios.map(scenario => (
              <div key={scenario.id} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-200">{scenario.name}</p>
                  <Badge className="bg-slate-700/50 text-slate-400 text-[10px]">{scenario.type}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Cost Impact</p>
                    <p className={`text-lg font-bold mt-0.5 ${scenario.estimatedCostDelta < 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {scenario.estimatedCostDelta < 0 ? '' : '+'}{formatCurrency(scenario.estimatedCostDelta)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">License Delta</p>
                    <p className={`text-lg font-bold mt-0.5 ${scenario.estimatedLicenseDelta < 0 ? 'text-green-400' : 'text-orange-400'}`}>
                      {scenario.estimatedLicenseDelta > 0 ? '+' : ''}{scenario.estimatedLicenseDelta}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                  <span className="text-[10px] text-slate-600">{scenario.createdAt}</span>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost">View</Button>
                    <Button size="sm" variant="secondary">Apply</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
