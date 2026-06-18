import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { roleRecommendations, roles } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { ArrowRight, TrendingDown } from 'lucide-react';

export function RoleReplacement() {
  const totalSavings = roleRecommendations.filter(r => r.annualSavings > 0).reduce((s, r) => s + r.annualSavings, 0);

  return (
    <div>
      <Topbar title="Role Replacement Engine" subtitle="AI-suggested lower-cost equivalent roles with TCode matching" />
      <div className="p-6 space-y-4">

        {/* Savings summary */}
        <Card className="border-green-500/30 bg-green-500/5 flex items-center gap-4">
          <TrendingDown size={22} className="text-green-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-300">Total identified savings from role replacements</p>
            <p className="text-2xl font-bold text-green-400 mt-0.5">{formatCurrency(totalSavings)} / year</p>
          </div>
        </Card>

        {/* Example role match card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleRecommendations.filter(r => r.annualSavings > 0).map(rec => {
            const currentRole = roles.find(r => r.name === rec.currentRole);
            const suggestedRole = roles.find(r => r.name === rec.suggestedRole);
            return (
              <Card key={rec.userId} className="border-indigo-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-200 text-sm">{rec.userName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{rec.reason}</p>
                  </div>
                  {rec.annualSavings > 0 && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">{formatCurrency(rec.annualSavings)}/yr</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                    <p className="text-[10px] text-red-400 uppercase font-medium mb-1">Current</p>
                    <code className="text-xs text-red-300 font-mono">{rec.currentRole}</code>
                    {currentRole && <p className="text-[10px] text-slate-500 mt-1">{formatCurrency(currentRole.costPerUser)}/yr</p>}
                  </div>
                  <ArrowRight size={16} className="text-slate-500 shrink-0" />
                  <div className="flex-1 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                    <p className="text-[10px] text-green-400 uppercase font-medium mb-1">Suggested</p>
                    <code className="text-xs text-green-300 font-mono">{rec.suggestedRole}</code>
                    {suggestedRole && <p className="text-[10px] text-slate-500 mt-1">{formatCurrency(suggestedRole.costPerUser)}/yr</p>}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Match score:</span>
                    <div className="bg-slate-700/50 rounded-full h-1.5 w-20">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${rec.matchScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-indigo-400">{rec.matchScore}%</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Review</Button>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Role similarity matrix */}
        <Card>
          <CardHeader><CardTitle>Role Similarity Matrix</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="pb-2 text-left text-slate-500 pr-4 font-medium">Role</th>
                  {roles.slice(0, 4).map(r => (
                    <th key={r.id} className="pb-2 text-center text-slate-500 font-mono font-medium px-3">{r.name.replace('SAP_', '')}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {roles.slice(0, 4).map((rowRole, i) => (
                  <tr key={rowRole.id} className="hover:bg-slate-800/40">
                    <td className="py-2 pr-4 font-mono text-slate-300">{rowRole.name.replace('SAP_', '')}</td>
                    {roles.slice(0, 4).map((colRole, j) => {
                      const val = i === j ? 100 : Math.max(0, 90 - Math.abs(i - j) * 22 + Math.floor(Math.random() * 10));
                      return (
                        <td key={colRole.id} className="py-2 px-3 text-center">
                          <span className={`font-bold ${val === 100 ? 'text-slate-500' : val > 70 ? 'text-green-400' : val > 40 ? 'text-yellow-400' : 'text-slate-600'}`}>
                            {i === j ? '—' : `${val}%`}
                          </span>
                        </td>
                      );
                    })}
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
