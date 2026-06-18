import { useState } from 'react';
import { Plus, Play, Pause, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { licenseRules } from '../../data/mockData';
import { statusColor } from '../../lib/utils';

export function RuleEngine() {
  const [rules, setRules] = useState(licenseRules);
  const [showBuilder, setShowBuilder] = useState(false);

  const toggle = (id: string) => {
    setRules(r => r.map(rule =>
      rule.id === id ? { ...rule, status: rule.status === 'active' ? 'disabled' : 'active' } : rule
    ));
  };

  return (
    <div>
      <Topbar title="License Rule Engine" subtitle="Automate license classification with no-code rules" />
      <div className="p-6 space-y-4">

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Active Rules', value: rules.filter(r => r.status === 'active').length, color: 'text-green-400' },
            { label: 'Draft Rules', value: rules.filter(r => r.status === 'draft').length, color: 'text-yellow-400' },
            { label: 'Total Matches Today', value: rules.reduce((s, r) => s + r.matchCount, 0).toLocaleString(), color: 'text-indigo-400' },
          ].map(s => (
            <Card key={s.label} className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Rule Builder CTA */}
        {showBuilder && (
          <Card className="border-indigo-500/30 bg-indigo-500/5">
            <CardHeader>
              <CardTitle>New Rule Builder</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setShowBuilder(false)}>✕</Button>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rule Name</label>
                <input className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="e.g. Finance AP → Professional" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Condition (IF)</label>
                <input className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="Department = Finance AND Role = AP_MANAGER" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Action (THEN)</label>
                <input className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="Assign Professional License" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Priority</label>
                <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" defaultValue={10} />
              </div>
              <div className="md:col-span-3 flex gap-2">
                <Button size="sm"><CheckCircle2 size={13} /> Save Rule</Button>
                <Button size="sm" variant="secondary"><Play size={13} /> Test Rule</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Classification Rules</CardTitle>
            <Button size="sm" onClick={() => setShowBuilder(true)}><Plus size={13} /> New Rule</Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase">
                  <th className="pb-2 text-left font-medium pr-4">#</th>
                  <th className="pb-2 text-left font-medium pr-4">Rule Name</th>
                  <th className="pb-2 text-left font-medium pr-4">Condition</th>
                  <th className="pb-2 text-left font-medium pr-4">Action</th>
                  <th className="pb-2 text-left font-medium pr-4">Status</th>
                  <th className="pb-2 text-right font-medium pr-4">Matches</th>
                  <th className="pb-2 text-right font-medium">Last Run</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pr-4 text-slate-500 text-xs">{rule.priority}</td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-200">{rule.name}</p>
                      <p className="text-xs text-slate-500">{rule.description}</p>
                    </td>
                    <td className="py-3 pr-4 max-w-xs">
                      <code className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-mono">{rule.condition}</code>
                    </td>
                    <td className="py-3 pr-4">
                      <code className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded font-mono">{rule.action}</code>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge className={statusColor(rule.status)}>{rule.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums text-slate-300">{rule.matchCount.toLocaleString()}</td>
                    <td className="py-3 text-right text-xs text-slate-500">{rule.lastRun ?? '—'}</td>
                    <td className="py-3 pl-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => toggle(rule.id)}>
                          {rule.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                        </Button>
                        <Button size="sm" variant="ghost"><Edit2 size={12} /></Button>
                        <Button size="sm" variant="ghost"><Trash2 size={12} /></Button>
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
