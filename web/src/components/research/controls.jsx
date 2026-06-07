import React from 'react';

/* Themed range slider with label + live value readout. */
export function Slider({ label, value, min, max, step = 0.01, onChange, format, hint, accentVar = 'var(--accent)' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.92rem] font-medium" style={{ fontFamily: 'Newsreader, serif', color: 'var(--ink)' }}>
          {label}
        </span>
        <span className="font-mono text-[12px] font-semibold" style={{ color: 'var(--accent)' }}>
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        className="research-slider mt-2 w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          background: `linear-gradient(to right, ${accentVar} 0%, ${accentVar} ${pct}%, rgba(33,29,24,0.14) ${pct}%, rgba(33,29,24,0.14) 100%)`,
        }}
      />
      {hint && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          {hint}
        </div>
      )}
    </label>
  );
}

/* Segmented preset selector (pill buttons). */
export function PresetButtons({ options, value, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-1.5 rounded-lg border p-1" style={{ borderColor: 'var(--rule)' }}>
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className="rounded-md px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors"
            style={{
              background: on ? 'var(--accent)' : 'transparent',
              color: on ? '#fff' : 'var(--muted)',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
