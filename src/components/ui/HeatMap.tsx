import { heatColor } from '../../lib/utils';
import type { HeatMapCell } from '../../types';

interface HeatMapProps {
  data: HeatMapCell[];
  xLabel?: string;
  yLabel?: string;
  maxValue?: number;
  formatValue?: (v: number) => string;
}

export function HeatMap({ data, maxValue, formatValue }: HeatMapProps) {
  const xValues = [...new Set(data.map((d) => d.x))];
  const yValues = [...new Set(data.map((d) => d.y))];
  const max = maxValue ?? Math.max(...data.map((d) => d.value));

  const getValue = (x: string, y: string) => data.find((d) => d.x === x && d.y === y);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="pb-2 pr-2 text-left text-slate-500 font-normal w-28" />
            {xValues.map((x) => (
              <th key={x} className="pb-2 px-1 text-center text-slate-400 font-medium whitespace-nowrap">
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {yValues.map((y) => (
            <tr key={y}>
              <td className="py-1 pr-3 text-right text-slate-400 whitespace-nowrap font-medium">{y}</td>
              {xValues.map((x) => {
                const cell = getValue(x, y);
                const val = cell?.value ?? 0;
                return (
                  <td key={x} className="py-0.5 px-1">
                    <div
                      className="rounded h-8 flex items-center justify-center font-semibold text-white/90 min-w-[48px] transition-transform hover:scale-105 cursor-default"
                      style={{ backgroundColor: heatColor(val, max) }}
                      title={`${y} / ${x}: ${formatValue ? formatValue(val) : val}`}
                    >
                      {cell?.label ?? (formatValue ? formatValue(val) : val)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Legend */}
      <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
        <span>Low</span>
        {['#1e3a5f', '#1d4ed8', '#7c3aed', '#db2777', '#dc2626'].map((c) => (
          <div key={c} className="h-3 w-8 rounded" style={{ backgroundColor: c }} />
        ))}
        <span>High</span>
      </div>
    </div>
  );
}
