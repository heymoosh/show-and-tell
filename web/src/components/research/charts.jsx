import React from 'react';

/* Shared tooltip for all research Recharts figures. */
export function ResearchTooltip({ active, payload, label, formatter, labelFormatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-md border bg-[#fbf8f0] px-3 py-2 shadow-lg"
      style={{ borderColor: 'rgba(33,29,24,0.18)' }}
    >
      {label !== undefined && (
        <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#6f655a' }}>
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="mt-1 space-y-0.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-[13px]" style={{ color: '#211d18' }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span style={{ fontFamily: 'Newsreader, serif' }}>
              {formatter ? formatter(p.value, p.name, p) : `${p.name}: ${p.value}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const AXIS = {
  tick: { fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' },
  stroke: 'rgba(33,29,24,0.2)',
};
