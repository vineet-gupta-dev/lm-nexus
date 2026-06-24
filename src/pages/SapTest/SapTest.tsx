import { useState, useCallback } from 'react';
import { Search, RefreshCw, AlertTriangle, CheckCircle2, Wifi } from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface BPRecord {
  BusinessPartner: string;
  BusinessPartnerFullName?: string;
  BusinessPartnerType?: string;
  BusinessPartnerCategory?: string;
  Industry?: string;
  CountryRegion?: string;
  CreationDate?: string;
}

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

const ENTITY_OPTIONS = [
  { value: 'A_BusinessPartner',          label: 'Business Partners' },
  { value: 'A_BusinessPartnerAddress',   label: 'BP Addresses' },
  { value: 'A_Customer',                 label: 'Customers' },
  { value: 'A_Supplier',                 label: 'Suppliers' },
];

export function SapTest() {
  const [entity, setEntity]   = useState('A_BusinessPartner');
  const [top, setTop]         = useState('20');
  const [filter, setFilter]   = useState('');
  const [status, setStatus]   = useState<FetchStatus>('idle');
  const [records, setRecords] = useState<BPRecord[]>([]);
  const [rawJson, setRawJson] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [tab, setTab]         = useState<'table' | 'raw'>('table');

  const fetchData = useCallback(async () => {
    setStatus('loading');
    setRecords([]);
    setRawJson('');
    setErrorMsg('');
    const t0 = Date.now();

    try {
      let url = `/api/business-partner?entity=${encodeURIComponent(entity)}&$top=${top}`;
      if (filter.trim()) url += `&$filter=${encodeURIComponent(filter.trim())}`;

      const res  = await fetch(url);
      const json = await res.json();
      setElapsed(Date.now() - t0);

      if (!res.ok) {
        const causeCode = json?.networkCause?.code ? ` (${json.networkCause.code})` : '';
        const details = json?.details ?? json?.error ?? `HTTP ${res.status}`;
        const hint = json?.hint ? ` Hint: ${json.hint}` : '';
        setErrorMsg(`${details}${causeCode}${hint}`);
        setStatus('error');
        return;
      }

      const rows: BPRecord[] = json?.d?.results ?? json?.value ?? [];
      setRecords(rows);
      setRawJson(JSON.stringify(json, null, 2));
      setStatus('success');
    } catch (e: any) {
      setElapsed(Date.now() - t0);
      setErrorMsg(e?.message ?? 'Network error');
      setStatus('error');
    }
  }, [entity, top, filter]);

  const columns = records.length > 0
    ? Object.keys(records[0]).filter(k => !k.startsWith('__')).slice(0, 8)
    : [];

  return (
    <div>
      <Topbar
        title="SAP OData Test"
        subtitle="Live connection · API_BUSINESS_PARTNER · vm401s4.dc01.securityweaver.com"
      />
      <div className="p-6 space-y-5">

        {/* Connection info banner */}
        <div className="flex items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3">
          <Wifi size={15} className="text-blue-400 shrink-0" />
          <p className="text-xs text-blue-300">
            Requests are proxied server-side via <code className="bg-blue-900/40 px-1 rounded">/api/business-partner</code>.
            SAP credentials are stored as environment variables — never exposed to the browser.
          </p>
        </div>

        {/* Query builder */}
        <Card>
          <CardHeader>
            <CardTitle>Query Builder</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1 min-w-[200px]">
              <label className="text-[11px] text-slate-500">Entity Set</label>
              <select
                value={entity}
                onChange={e => setEntity(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {ENTITY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 w-24">
              <label className="text-[11px] text-slate-500">$top (rows)</label>
              <input
                type="number"
                value={top}
                min={1}
                max={100}
                onChange={e => setTop(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
              <label className="text-[11px] text-slate-500">$filter (optional)</label>
              <input
                type="text"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="e.g. BusinessPartnerType eq '1'"
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>

            <button
              onClick={fetchData}
              disabled={status === 'loading'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-medium text-white transition-colors"
            >
              {status === 'loading'
                ? <RefreshCw size={14} className="animate-spin" />
                : <Search size={14} />
              }
              {status === 'loading' ? 'Fetching…' : 'Fetch from SAP'}
            </button>
          </div>
        </Card>

        {/* Status bar */}
        {status !== 'idle' && (
          <div className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs ${
            status === 'loading'
              ? 'border-slate-600 text-slate-400'
              : status === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/40 bg-red-500/10 text-red-300'
          }`}>
            {status === 'success'  && <CheckCircle2 size={13} />}
            {status === 'error'    && <AlertTriangle size={13} />}
            {status === 'loading'  && <RefreshCw size={13} className="animate-spin" />}
            {status === 'loading'  && 'Connecting to SAP…'}
            {status === 'success'  && `${records.length} record${records.length !== 1 ? 's' : ''} returned · ${elapsed}ms`}
            {status === 'error'    && `Error: ${errorMsg}`}
          </div>
        )}

        {/* Results */}
        {status === 'success' && records.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Results — {entity}</CardTitle>
              <div className="flex gap-1">
                <button
                  onClick={() => setTab('table')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setTab('raw')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === 'raw' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                >
                  Raw JSON
                </button>
              </div>
            </CardHeader>

            {tab === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      {columns.map(col => (
                        <th key={col} className="py-2 px-3 text-left text-slate-400 font-medium whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {records.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        {columns.map(col => (
                          <td key={col} className="py-2 px-3 text-slate-300 whitespace-nowrap max-w-[200px] truncate">
                            {col === 'BusinessPartner'
                              ? <Badge variant="outline" className="text-indigo-300 border-indigo-500/40">{(row as any)[col]}</Badge>
                              : String((row as any)[col] ?? '—')
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'raw' && (
              <pre className="overflow-x-auto overflow-y-auto max-h-[500px] text-[11px] text-slate-300 bg-slate-950 rounded-lg p-4 leading-relaxed">
                {rawJson}
              </pre>
            )}
          </Card>
        )}

        {status === 'success' && records.length === 0 && (
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 py-12 text-center text-slate-500 text-sm">
            No records returned. Try adjusting your filter or entity set.
          </div>
        )}
      </div>
    </div>
  );
}
