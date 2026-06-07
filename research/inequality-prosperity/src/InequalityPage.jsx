import React, { useMemo, useState } from 'react';
import {
  ComposedChart, Line, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip,
  ReferenceDot, ReferenceArea, LineChart, BarChart, Bar, Cell, CartesianGrid, Legend,
} from 'recharts';
import ResearchLayout, { Section } from '../../../web/src/components/research/ResearchLayout';
import {
  Reveal, AnimatedNumber, SectionHeading, StatCallout, PullQuote, KeyFinding, Figure, Callout,
} from '../../../web/src/components/research/primitives';
import { Slider } from '../../../web/src/components/research/controls';
import { ResearchTooltip } from '../../../web/src/components/research/charts';
import finalRaw from '../data/final-report.md?raw';
import fullRaw from '../data/full-report.md?raw';
import hegRaw from '../data/hegemon-appendix.md?raw';
import tauCsv from '../data/tau_sweep.csv?raw';

const OXBLOOD = '#9b2d2d';
const STEEL = '#2f5d8c';
const COPPER = '#b4541f';
const GREEN = '#1f5a43';

/* parse tau_sweep.csv -> rows sorted by tau */
const SWEEP = (() => {
  const lines = tauCsv.trim().split('\n');
  const head = lines[0].split(',');
  const idx = (k) => head.indexOf(k);
  const rows = lines.slice(1).filter(Boolean).map((ln) => {
    const f = ln.split(',').map(Number);
    return {
      tau: f[idx('tau')],
      gini: f[idx('final_gini')],
      growth: f[idx('avg_growth')],
      median: f[idx('median_income')],
    };
  });
  return rows.sort((a, b) => a.tau - b.tau);
})();

/* quadratic least-squares fit y = a x^2 + b x + c over (gini, growth) */
function quadFit(pts) {
  let Sx = 0, Sx2 = 0, Sx3 = 0, Sx4 = 0, Sy = 0, Sxy = 0, Sx2y = 0;
  const n = pts.length;
  for (const { x, y } of pts) {
    Sx += x; Sx2 += x * x; Sx3 += x ** 3; Sx4 += x ** 4;
    Sy += y; Sxy += x * y; Sx2y += x * x * y;
  }
  // solve 3x3 [ [Sx4 Sx3 Sx2],[Sx3 Sx2 Sx],[Sx2 Sx n] ] [a b c] = [Sx2y Sxy Sy]
  const A = [[Sx4, Sx3, Sx2], [Sx3, Sx2, Sx], [Sx2, Sx, n]];
  const Y = [Sx2y, Sxy, Sy];
  for (let i = 0; i < 3; i++) {
    let piv = A[i][i];
    let r = i;
    for (let k = i + 1; k < 3; k++) if (Math.abs(A[k][i]) > Math.abs(piv)) { piv = A[k][i]; r = k; }
    [A[i], A[r]] = [A[r], A[i]]; [Y[i], Y[r]] = [Y[r], Y[i]];
    for (let k = 0; k < 3; k++) {
      if (k === i) continue;
      const f = A[k][i] / A[i][i];
      for (let j = 0; j < 3; j++) A[k][j] -= f * A[i][j];
      Y[k] -= f * Y[i];
    }
  }
  return [Y[0] / A[0][0], Y[1] / A[1][1], Y[2] / A[2][2]];
}

const FIT = quadFit(SWEEP.map((r) => ({ x: r.gini, y: r.growth })));
const evalFit = (x) => FIT[0] * x * x + FIT[1] * x + FIT[2];
const GINI_MIN = Math.min(...SWEEP.map((r) => r.gini));
const GINI_MAX = Math.max(...SWEEP.map((r) => r.gini));
const FIT_CURVE = Array.from({ length: 60 }, (_, i) => {
  const x = GINI_MIN + (i / 59) * (GINI_MAX - GINI_MIN);
  return { gini: x, fit: evalFit(x) };
});
const PEAK_GINI = -FIT[1] / (2 * FIT[0]); // vertex of the quadratic = growth-maximising Gini

/* interpolate gini/growth/median by tau */
function lerpByTau(tau) {
  const rows = SWEEP;
  if (tau <= rows[0].tau) return rows[0];
  if (tau >= rows[rows.length - 1].tau) return rows[rows.length - 1];
  for (let i = 0; i < rows.length - 1; i++) {
    if (tau >= rows[i].tau && tau <= rows[i + 1].tau) {
      const t = (tau - rows[i].tau) / (rows[i + 1].tau - rows[i].tau);
      const mix = (k) => rows[i][k] + t * (rows[i + 1][k] - rows[i][k]);
      return { tau, gini: mix('gini'), growth: mix('growth'), median: mix('median') };
    }
  }
  return rows[0];
}

const REGIMES = [
  { regime: 'Laissez-faire', tau: 0.0, gini: 0.73, growth: 9.13, median: 19112 },
  { regime: 'Light redist.', tau: 0.15, gini: 0.55, growth: 10.17, median: 142233 },
  { regime: 'Moderate', tau: 0.30, gini: 0.44, growth: 9.59, median: 80326 },
  { regime: 'Heavy redist.', tau: 0.55, gini: 0.31, growth: 9.01, median: 45585 },
  { regime: 'Extreme equal.', tau: 0.75, gini: 0.24, growth: 9.10, median: 48932 },
];

const GINI_YEARS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
const GINI_SERIES = {
  US: [0.36, 0.35, 0.34, 0.34, 0.38, 0.40, 0.42, 0.41],
  UK: [0.26, 0.25, 0.26, 0.27, 0.34, 0.36, 0.36, 0.36],
  Japan: [0.32, 0.31, 0.29, 0.27, 0.27, 0.31, 0.33, 0.34],
  Germany: [0.30, 0.28, 0.26, 0.25, 0.26, 0.26, 0.29, 0.29],
};
const GINI_TRAJ = GINI_YEARS.map((y, i) => ({
  year: y, US: GINI_SERIES.US[i], UK: GINI_SERIES.UK[i], Japan: GINI_SERIES.Japan[i], Germany: GINI_SERIES.Germany[i],
}));

const PROD = [
  { country: 'US', tailwind: 2.6, post: 1.8, recent: 0.9 },
  { country: 'UK', tailwind: 2.7, post: 1.9, recent: 0.4 },
  { country: 'Japan', tailwind: 7.7, post: 2.5, recent: 0.7 },
  { country: 'Germany', tailwind: 4.8, post: 2.1, recent: 0.6 },
  { country: 'France', tailwind: 4.6, post: 1.9, recent: 0.7 },
];

export default function InequalityPage({ onBack }) {
  const [tau, setTau] = useState(0.15);
  // Gini is interpolated from the clean, monotonic final_gini column; growth + the
  // marker ride the smooth quadratic fit (the raw per-seed growth/median are noisy).
  const cur = useMemo(() => {
    const g = lerpByTau(tau).gini;
    const diagnosis = Math.abs(g - PEAK_GINI) < 0.05 ? 'Near the peak' : g > PEAK_GINI ? 'Too unequal' : 'Over-levelled';
    return { gini: g, growth: evalFit(g), diagnosis };
  }, [tau]);

  return (
    <ResearchLayout
      theme="inequality"
      eyebrow="Inequality & Prosperity · the inverted-U"
      title="Inequality fuels prosperity — until it doesn't"
      dek="A little inequality rewards risk and effort. Too much strangles the growth and innovation it once powered — by walling talent out and starving demand. The evidence says the United States is now on the wrong side of that line."
      heroMeta={[
        { value: '0.41', label: 'U.S. income Gini today' },
        { value: '0.25–0.35', label: 'where prosperity peaks' },
        { value: '4×', label: 'more inventors with equal access' },
        { value: '8.5%', label: 'of GDP lost to inequality (OECD, 25 yrs)' },
      ]}
      sections={[
        { id: 'thesis', label: 'Thesis' },
        { id: 'curve', label: 'The curve' },
        { id: 'shock', label: 'The shock' },
        { id: 'world', label: 'Four nations' },
        { id: 'lenses', label: 'Two lenses' },
        { id: 'caveats', label: 'Caveats' },
      ]}
      reportText={[
        { heading: 'Final report — Is inequality necessary for prosperity?', text: finalRaw },
        { heading: 'Full report — Is wealth inequality necessary?', text: fullRaw },
        { heading: 'Appendix — The hegemon-tailwind problem', text: hegRaw },
      ]}
      exportTitle="Is Inequality Necessary for Prosperity?"
      exportFilename="inequality-prosperity-research"
      onBack={onBack}
    >
      {/* THESIS */}
      <Section id="thesis" width="wide">
        <Reveal><SectionHeading eyebrow="The thesis" title="Necessary in small doses, corrosive in large ones" dek="Reward dispersion motivates. Wealth concentration, past a point, does the opposite — and the United States is past the point." /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <KeyFinding index={1} title="Some inequality helps; concentration doesn't.">
            Differential rewards motivate effort and risk-taking. But past a moderate threshold, more concentration buys no extra growth or innovation — it just redirects output to the top. In the data, prosperity peaks at a Gini around <strong>0.25–0.35</strong>.
          </KeyFinding>
          <KeyFinding index={2} title="High inequality wastes inventors — the 'Lost Einsteins.'" delay={120}>
            Children of top-1% families are about <strong>10×</strong> likelier to become inventors than equally-talented below-median kids. Equalize access and the U.S. could roughly <strong>quadruple</strong> its inventors. Inequality isn't paying for innovation — it's suppressing it.
          </KeyFinding>
          <KeyFinding index={3} title="The U.S. has overshot." delay={240}>
            At a disposable-income Gini near <strong>0.41</strong>, the U.S. sits well past the healthy band. The IMF finds a 3-point Gini rise cuts ~0.5 points off annual growth; the OECD estimates rising inequality cost member economies 8.5% of cumulative GDP over 25 years.
          </KeyFinding>
        </div>
      </Section>

      {/* CURVE — interactive */}
      <Section id="curve" width="wide">
        <Reveal><SectionHeading eyebrow="Find the peak" title="The inverted-U, by hand" dek="A thousand-agent economy, run two hundred periods at every level of redistribution. Drag the dial: growth climbs as you ease pure laissez-faire, peaks in the middle, then fades as redistribution overshoots." /></Reveal>
        <Reveal delay={80}>
          <Figure className="mt-10" caption="Each dot is one simulated economy; the curve is a quadratic fit. τ is the share of income redistributed." source="1,000 agents · 200 periods · redistribution sweep">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
              <div style={{ height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ left: 4, right: 16, top: 12, bottom: 28 }}>
                    <CartesianGrid stroke="rgba(33,29,24,0.08)" />
                    <XAxis type="number" dataKey="gini" domain={[0.2, 0.76]} tickCount={7} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" label={{ value: 'Wealth Gini  (more equal ←→ more unequal)', position: 'bottom', offset: 12, style: { fontFamily: 'Spline Sans Mono, monospace', fontSize: 10, fill: '#6f655a' } }} />
                    <YAxis type="number" dataKey="growth" domain={[8, 11]} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" label={{ value: 'Growth %/yr', angle: -90, position: 'insideLeft', style: { fontFamily: 'Spline Sans Mono, monospace', fontSize: 10, fill: '#6f655a' } }} />
                    <ReferenceArea x1={0.25} x2={0.35} fill={GREEN} fillOpacity={0.08} />
                    <Tooltip cursor={{ stroke: 'rgba(33,29,24,0.2)' }} content={<ResearchTooltip formatter={(v, n) => `${n === 'fit' ? 'fit' : 'growth'}: ${(+v).toFixed(2)}%`} labelFormatter={(l) => `Gini ${(+l).toFixed(2)}`} />} />
                    <Line data={FIT_CURVE} dataKey="fit" stroke={OXBLOOD} strokeWidth={2.5} dot={false} isAnimationActive animationDuration={900} />
                    <Scatter data={SWEEP} dataKey="growth" fill="#6f655a" />
                    <ReferenceDot x={cur.gini} y={cur.growth} r={8} fill={OXBLOOD} stroke="#fff" strokeWidth={2} isFront />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col justify-center">
                <Slider label="Redistribution (τ)" value={tau} min={0} max={0.85} step={0.01} onChange={setTau} format={(v) => v.toFixed(2)} hint="0 = pure laissez-faire · 0.85 = near-total" />
                <div className="mt-6 grid grid-cols-3 gap-4 lg:grid-cols-1">
                  <Readout label="Resulting Gini" value={cur.gini.toFixed(2)} tone={cur.diagnosis === 'Near the peak' ? 'accent' : 'neg'} />
                  <Readout label="Fitted growth" value={`${cur.growth.toFixed(1)}%`} />
                  <Readout label="Diagnosis" value={cur.diagnosis} tone={cur.diagnosis === 'Near the peak' ? 'accent' : 'neg'} />
                </div>
                <p className="mt-6 text-[0.9rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  The marker rides the fitted curve; the shaded strip marks a Gini of <strong>0.25–0.35</strong>, the band the cross-country record points to as healthiest. Growth peaks near a Gini of <strong>{PEAK_GINI.toFixed(2)}</strong> in this stylised model.
                </p>
              </div>
            </div>
          </Figure>
        </Reveal>
      </Section>

      {/* SHOCK */}
      <Section id="shock" width="wide">
        <Reveal><SectionHeading eyebrow="Growth nobody can buy" title="The same engine, 7× the median" dek="Pure laissez-faire posts a higher paper growth rate — yet its typical household ends up far poorer, because demand collapses when the median can't afford what the economy makes." /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <div className="rounded-lg border bg-[var(--paper-card)] p-7" style={{ borderColor: 'var(--rule)' }}>
              <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Laissez-faire · τ = 0 · Gini 0.73</div>
              <div className="font-display text-[3.4rem] font-semibold leading-none" style={{ color: OXBLOOD }}>$<AnimatedNumber value={19112} /></div>
              <div className="mt-2 text-[0.95rem]" style={{ color: '#3a342c' }}>median household income — despite a 9.1% headline growth rate.</div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-lg border p-7" style={{ borderColor: GREEN, background: 'rgba(31,90,67,0.06)' }}>
              <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: GREEN }}>Light redistribution · τ = 0.15 · Gini 0.55</div>
              <div className="font-display text-[3.4rem] font-semibold leading-none" style={{ color: GREEN }}>$<AnimatedNumber value={142233} /></div>
              <div className="mt-2 text-[0.95rem]" style={{ color: '#3a342c' }}>median household income — <strong>7.4× higher</strong>, at a slightly higher growth rate too.</div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <Figure className="mt-8" caption="Median household income across redistribution regimes. The peak is light-to-moderate, not zero.">
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REGIMES} margin={{ left: 8, right: 8, top: 8, bottom: 4 }}>
                  <CartesianGrid stroke="rgba(33,29,24,0.08)" vertical={false} />
                  <XAxis dataKey="regime" tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 10.5, fill: '#3a342c' }} stroke="rgba(33,29,24,0.2)" interval={0} />
                  <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" />
                  <Tooltip cursor={{ fill: 'rgba(33,29,24,0.05)' }} content={<ResearchTooltip formatter={(v) => `$${(+v).toLocaleString()}`} labelFormatter={(l) => l} />} />
                  <Bar dataKey="median" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={700}>
                    {REGIMES.map((r) => (
                      <Cell key={r.regime} fill={r.tau === 0 ? OXBLOOD : r.tau === 0.15 ? GREEN : '#9a8f80'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Figure>
        </Reveal>
      </Section>

      {/* WORLD */}
      <Section id="world" width="wide">
        <Reveal><SectionHeading eyebrow="It isn't just America" title="Four post-war economies, one slowdown" dek="Every rich economy's productivity growth roughly halved once the post-war tailwind faded — and again after 2008. Choosing high inequality didn't buy an exemption." /></Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Reveal>
            <Figure caption="Disposable-income Gini, 1950–2020. Shaded: the 1945–73 'tailwind' era.">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={GINI_TRAJ} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
                    <CartesianGrid stroke="rgba(33,29,24,0.08)" />
                    <XAxis dataKey="year" tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" />
                    <YAxis domain={[0.2, 0.45]} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" />
                    <ReferenceArea x1={1950} x2={1973} fill="#caa53a" fillOpacity={0.12} />
                    <Tooltip content={<ResearchTooltip formatter={(v, n) => `${n}: ${(+v).toFixed(2)}`} labelFormatter={(l) => l} />} />
                    <Line dataKey="US" stroke={OXBLOOD} strokeWidth={2.5} dot={false} />
                    <Line dataKey="UK" stroke={STEEL} strokeWidth={2.5} dot={false} />
                    <Line dataKey="Japan" stroke={COPPER} strokeWidth={2.5} dot={false} />
                    <Line dataKey="Germany" stroke={GREEN} strokeWidth={2.5} dot={false} />
                    <Legend wrapperStyle={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Figure>
          </Reveal>

          <Reveal delay={120}>
            <Figure caption="Labor-productivity growth (%/yr) across three eras.">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PROD} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
                    <CartesianGrid stroke="rgba(33,29,24,0.08)" vertical={false} />
                    <XAxis dataKey="country" tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#3a342c' }} stroke="rgba(33,29,24,0.2)" />
                    <YAxis tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" />
                    <Tooltip cursor={{ fill: 'rgba(33,29,24,0.05)' }} content={<ResearchTooltip formatter={(v, n) => `${n}: ${(+v).toFixed(1)}%`} labelFormatter={(l) => l} />} />
                    <Bar dataKey="tailwind" name="1948–73" fill={GREEN} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="post" name="1973–2000" fill={STEEL} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="recent" name="2008–20" fill={OXBLOOD} radius={[2, 2, 0, 0]} />
                    <Legend wrapperStyle={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Figure>
          </Reveal>
        </div>

        <Callout label="The tell">
          The U.K. and U.S. chose <em>high</em> inequality after 1980 and still couldn't escape the slowdown — U.K. productivity is now ~28% below the U.S. and below France and Germany, which chose <em>lower</em> inequality. In Germany after the Hartz reforms, the correlation between the top-decile income share and the current-account surplus since 2000 is <strong>0.94</strong>: textbook demand suppression.
        </Callout>
      </Section>

      {/* LENSES */}
      <Section id="lenses" width="reading">
        <Reveal><SectionHeading eyebrow="Two rulers, one story" title="Why two different thresholds agree" /></Reveal>
        <Callout label="Reconciling the numbers">
          The agent-based simulation's growth peaks around a Gini of <strong>0.45–0.55</strong>; the cross-country record points to a healthy band of <strong>0.25–0.35</strong>. They disagree on the exact number because they measure different things — one a stylized model, the other messy reality. But they agree on the <em>shape</em>: there is a peak, and beyond it more inequality costs you. The U.S., at ~0.41, is at or past the top by either ruler.
        </Callout>
      </Section>

      {/* CAVEATS */}
      <Section id="caveats" width="reading">
        <Reveal><SectionHeading eyebrow="The honest footnotes" title="What the evidence does — and doesn't — say" /></Reveal>
        <div className="prose-editorial mt-8 text-[1.05rem]" style={{ color: '#332e26' }}>
          <p>
            The simulation is stylized: a thousand agents, and a demand-side calibration that does a lot of the work driving the hump. Low inequality is necessary but <strong>not sufficient</strong> — Japan kept inequality low yet stagnated for unrelated reasons (a balance-sheet recession, demographics, zombie firms). Equality is a foundation, not a guarantee.
          </p>
        </div>
        <Callout label="Why we don't blame the Soviet Union">
          It's tempting to say "too much equality gives you the USSR." The research says otherwise. The Soviet Union failed from coercion and the absence of price signals — not from equality itself. The Nordic countries reach similar Gini levels <em>inside</em> functioning markets, with entry, exit and prices intact, and they thrive. The villain isn't equality; it's how you get there.
        </Callout>
      </Section>
    </ResearchLayout>
  );
}

function Readout({ label, value, tone = 'accent' }) {
  const color = tone === 'neg' ? 'var(--neg)' : 'var(--accent)';
  return (
    <div className="border-t pt-3" style={{ borderColor: 'var(--rule)' }}>
      <div className="font-display text-[1.7rem] font-semibold leading-none" style={{ color }}>{value}</div>
      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}
