import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
  ReferenceDot, ReferenceArea, BarChart, Bar, Cell, CartesianGrid, Legend,
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
import e1Csv from '../data/e1_necessity.csv?raw';

const OXBLOOD = '#9b2d2d';
const STEEL = '#2f5d8c';
const COPPER = '#b4541f';
const GREEN = '#1f5a43';
const NEUTRAL = '#9a8f80';

/* parse e1_necessity.csv -> rows on the reward-dispersion (rho) x redistribution (tau) grid */
const E1 = (() => {
  const lines = e1Csv.trim().split('\n');
  const head = lines[0].split(',');
  const idx = (k) => head.indexOf(k);
  return lines.slice(1).filter(Boolean).map((ln) => {
    const f = ln.split(',').map(Number);
    return {
      rho: f[idx('rho')],
      tau: f[idx('tau')],
      innov: f[idx('cumulative_innovations_mean')],
      innovLo: f[idx('cumulative_innovations_ci_lo')],
      innovHi: f[idx('cumulative_innovations_ci_hi')],
      giniW: f[idx('final_gini_wealth_mean')],
      giniI: f[idx('final_gini_income_mean')],
      lostE: f[idx('lost_einstein_share_mean')],
      poverty: f[idx('poverty_gated_share_mean')],
      blockedInc: f[idx('blocked_incentive_mean')],
    };
  });
})();

const RHOS = [...new Set(E1.map((r) => r.rho))].sort((a, b) => a - b);
const TAUS = [...new Set(E1.map((r) => r.tau))].sort((a, b) => a - b);
const TAU_MAX = Math.max(...TAUS);
const find = (rho, tau) =>
  E1.reduce((best, r) =>
    Math.abs(r.rho - rho) + Math.abs(r.tau - tau) < Math.abs(best.rho - rho) + Math.abs(best.tau - tau) ? r : best);
const seriesFor = (rho) => E1.filter((r) => r.rho === rho).sort((a, b) => a.tau - b.tau);
const peakTauFor = (rho) => seriesFor(rho).reduce((b, r) => (r.innov > b.innov ? r : b)).tau;

/* lost-Einstein share vs tau at the illustrative reward level rho = 1.5 */
const LOST_SERIES = seriesFor(1.5).map((r) => ({ tau: r.tau, lost: r.lostE * 100, innov: r.innov }));

/* empirical, real-world data (unchanged — these are observations, not the model) */
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

const pct = (x) => `${Math.round(x * 100)}%`;

export default function InequalityPage({ onBack }) {
  const [rho, setRho] = useState(1.5);
  const [tau, setTau] = useState(0.3);

  const series = useMemo(() => seriesFor(rho), [rho]);
  const peakTau = useMemo(() => peakTauFor(rho), [rho]);
  const cur = useMemo(() => find(rho, tau), [rho, tau]);
  const diagnosis = cur.innov === 0
    ? 'No reward, no innovation'
    : Math.abs(tau - peakTau) < 1e-6
      ? 'At the innovation peak'
      : tau < peakTau ? 'Under-investing (talent walled out)' : 'Over-taxing (reward too small)';

  return (
    <ResearchLayout
      theme="inequality"
      eyebrow="Inequality & Prosperity · the necessity test"
      title="Inequality fuels prosperity — until it doesn't"
      dek="Differential reward motivates invention. Standing wealth concentration does the opposite — it walls talented people out before they ever try. A rebuilt agent-based model separates the two, and finds that the United States is paying for concentration it doesn't need."
      heroMeta={[
        { value: '0.41', label: 'U.S. income Gini today' },
        { value: '0.25–0.35', label: 'income Gini where innovation peaks' },
        { value: '4×', label: 'more inventors with equal access' },
        { value: '~99%', label: 'of top talent idle under laissez-faire (model)' },
      ]}
      sections={[
        { id: 'thesis', label: 'Thesis' },
        { id: 'curve', label: 'Necessity test' },
        { id: 'shock', label: 'Lost Einsteins' },
        { id: 'world', label: 'Four nations' },
        { id: 'lenses', label: 'Two rulers' },
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
        <Reveal><SectionHeading eyebrow="The thesis" title="Reward dispersion, yes. Wealth concentration, no." dek="A simulation can't prove what's true of real economies. What it can do is pull apart two things that always travel together in the data — the reward to an innovator, and the concentration of standing wealth — and ask which one invention actually needs." /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <KeyFinding index={1} title="Some inequality helps; concentration doesn't.">
            Differential rewards motivate effort and risk-taking — kill the reward and invention stops. But holding the reward fixed, more <em>standing</em> concentration buys no extra innovation. In both the cross-country record and the model, the sweet spot sits at an income Gini around <strong>0.25–0.35</strong>.
          </KeyFinding>
          <KeyFinding index={2} title="High inequality wastes inventors — the 'Lost Einsteins.'" delay={120}>
            Children of top-1% families are about <strong>10×</strong> likelier to become inventors than equally-talented below-median kids. Equalize access and the U.S. could roughly <strong>quadruple</strong> its inventors. The rebuilt model reproduces this endogenously: at pure laissez-faire it leaves ~<strong>99%</strong> of its most talented agents idle.
          </KeyFinding>
          <KeyFinding index={3} title="The U.S. has overshot." delay={240}>
            At a disposable-income Gini near <strong>0.41</strong>, the U.S. sits well past the healthy band. The IMF finds a 3-point Gini rise cuts ~0.5 points off annual growth; the OECD estimates rising inequality cost member economies 8.5% of cumulative GDP over 25 years.
          </KeyFinding>
        </div>
      </Section>

      {/* CURVE — interactive necessity test */}
      <Section id="curve" width="wide">
        <Reveal><SectionHeading eyebrow="Decouple the levers" title="The necessity test, by hand" dek="A thousand-agent economy, 200 periods, 30 seeds per setting. Talent is handed out independently of wealth. Set how large the reward to invention is (ρ), then dial redistribution (τ). Laissez-faire is never the peak — for any reward level, innovation maxes out at an interior amount of redistribution." /></Reveal>
        <Reveal delay={80}>
          <Figure className="mt-10" caption="Cumulative innovations vs redistribution τ, at the selected reward level ρ. Green bar = the innovation-maximising τ; it is never τ = 0." source="rebuilt agent-based model · 1,000 agents · 200 periods · 30 seeds">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
              <div style={{ height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series} margin={{ left: 8, right: 16, top: 12, bottom: 28 }}>
                    <CartesianGrid stroke="rgba(33,29,24,0.08)" vertical={false} />
                    <XAxis dataKey="tau" tickFormatter={(v) => v.toFixed(1)} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" label={{ value: 'Redistribution τ  (laissez-faire ←→ heavy)', position: 'bottom', offset: 12, style: { fontFamily: 'Spline Sans Mono, monospace', fontSize: 10, fill: '#6f655a' } }} />
                    <YAxis tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" label={{ value: 'Cumulative innovations', angle: -90, position: 'insideLeft', style: { fontFamily: 'Spline Sans Mono, monospace', fontSize: 10, fill: '#6f655a' } }} />
                    <Tooltip cursor={{ fill: 'rgba(33,29,24,0.05)' }} content={<ResearchTooltip formatter={(v) => `${(+v).toLocaleString(undefined, { maximumFractionDigits: 0 })} innovations`} labelFormatter={(l) => `τ ${(+l).toFixed(1)}`} />} />
                    <Bar dataKey="innov" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={600}>
                      {series.map((r) => (
                        <Cell key={r.tau} fill={Math.abs(r.tau - tau) < 1e-6 ? OXBLOOD : Math.abs(r.tau - peakTau) < 1e-6 ? GREEN : NEUTRAL} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col justify-center">
                <div className="mb-5">
                  <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Reward to invention (ρ)</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {RHOS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setRho(r)}
                        className="rounded border px-2.5 py-1 font-mono text-[12px] transition-colors"
                        style={{
                          borderColor: r === rho ? OXBLOOD : 'var(--rule)',
                          background: r === rho ? OXBLOOD : 'transparent',
                          color: r === rho ? '#fff' : 'var(--muted)',
                        }}
                      >{r.toFixed(1)}</button>
                    ))}
                  </div>
                </div>
                <Slider label="Redistribution (τ)" value={tau} min={0} max={TAU_MAX} step={0.1} onChange={(v) => setTau(Math.round(v * 10) / 10)} format={(v) => v.toFixed(1)} hint="0 = laissez-faire" />
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-1">
                  <Readout label="Innovations" value={cur.innov.toLocaleString(undefined, { maximumFractionDigits: 0 })} tone={Math.abs(tau - peakTau) < 1e-6 ? 'accent' : 'neg'} />
                  <Readout label="Income Gini" value={cur.giniI.toFixed(2)} />
                  <Readout label="Wealth Gini" value={cur.giniW.toFixed(2)} />
                  <Readout label="Talent left idle" value={pct(cur.lostE)} tone="neg" />
                </div>
                <p className="mt-6 text-[0.9rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  Diagnosis: <strong>{diagnosis}</strong>. The innovation peak shifts to <em>higher</em> redistribution as the reward grows — a bigger prize can absorb more tax before incentives break. At every reward level the peak's <em>income</em> Gini lands near the Nordic 0.25–0.35, while the <em>wealth</em> Gini stays high (~0.70), exactly as in real economies.
                </p>
              </div>
            </div>
          </Figure>
        </Reveal>
        <Callout label="Where the help comes from">
          Redistribution raises innovation only insofar as it funds <em>public investment</em>. Switch off tax-funded public R&D in the model and the entire upslope vanishes — innovation falls monotonically with τ, which is exactly the spurious "redistribution hurts" result the original (buggy) version produced. Switch off the incentive channel and the downslope vanishes. Credit-market depth and pure cash transfers barely move the result. The lever is what the revenue buys, not the transfer itself.
        </Callout>
      </Section>

      {/* SHOCK — the Lost Einsteins */}
      <Section id="shock" width="wide">
        <Reveal><SectionHeading eyebrow="The cost of concentration" title="Laissez-faire wastes the talent it claims to reward" dek="With talent spread evenly across the wealth ladder but opportunity is not, pure laissez-faire leaves almost every gifted person too poor to ever try. Redistribution that funds education and research lets them in — until taxes climb so high the reward no longer justifies the risk." /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <div className="rounded-lg border bg-[var(--paper-card)] p-7" style={{ borderColor: 'var(--rule)' }}>
              <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Laissez-faire · τ = 0 · wealth Gini 0.89</div>
              <div className="font-display text-[3.4rem] font-semibold leading-none" style={{ color: OXBLOOD }}><AnimatedNumber value={99} />%</div>
              <div className="mt-2 text-[0.95rem]" style={{ color: '#3a342c' }}>of the most talented agents never innovate — 36% are simply too poor to afford the education to qualify.</div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-lg border p-7" style={{ borderColor: GREEN, background: 'rgba(31,90,67,0.06)' }}>
              <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: GREEN }}>At the innovation peak · τ = 0.3 · income Gini 0.31</div>
              <div className="font-display text-[3.4rem] font-semibold leading-none" style={{ color: GREEN }}><AnimatedNumber value={51} />%</div>
              <div className="mt-2 text-[0.95rem]" style={{ color: '#3a342c' }}>idle — nearly half the wasted inventors recovered, and innovation rises <strong>28×</strong> (93 → 2,604).</div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <Figure className="mt-8" caption="Share of top-talent agents left idle as redistribution rises (reward ρ = 1.5). The curve bottoms out at the innovation peak, then climbs again as high taxes deter even the able.">
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LOST_SERIES} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid stroke="rgba(33,29,24,0.08)" />
                  <XAxis dataKey="tau" tickFormatter={(v) => v.toFixed(1)} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" label={{ value: 'Redistribution τ', position: 'bottom', offset: 0, style: { fontFamily: 'Spline Sans Mono, monospace', fontSize: 10, fill: '#6f655a' } }} />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" />
                  <ReferenceArea x1={0.3} x2={0.3} />
                  <Tooltip content={<ResearchTooltip formatter={(v) => `${(+v).toFixed(0)}% idle`} labelFormatter={(l) => `τ ${(+l).toFixed(1)}`} />} />
                  <Line dataKey="lost" stroke={OXBLOOD} strokeWidth={2.5} dot={{ r: 3, fill: OXBLOOD }} isAnimationActive animationDuration={800} />
                  <ReferenceDot x={0.3} y={51} r={6} fill={GREEN} stroke="#fff" strokeWidth={2} isFront />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Figure>
        </Reveal>
      </Section>

      {/* WORLD */}
      <Section id="world" width="wide">
        <Reveal><SectionHeading eyebrow="It isn't just a model" title="Four post-war economies, one slowdown" dek="Every rich economy's productivity growth roughly halved once the post-war tailwind faded — and again after 2008. Choosing high inequality didn't buy an exemption." /></Reveal>

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
        <Reveal><SectionHeading eyebrow="Two rulers, one story" title="Why the model and the world agree" /></Reveal>
        <Callout label="Income Gini vs wealth Gini">
          The earlier version of this page compared the model's <em>wealth</em> Gini against the world's <em>income</em> Gini — apples to oranges, and the audit flagged it. Measured correctly, they line up. At the model's innovation peak the <strong>income</strong> Gini is ≈ 0.25–0.31 — squarely the Nordic range the cross-country record points to — while the <strong>wealth</strong> Gini stays high (~0.70), which is also true of the real Nordics and far below the U.S. wealth Gini of ~0.85. One ruler for flows, one for stocks; both say the U.S. is past the healthy band.
        </Callout>
        <PullQuote>
          Inequality isn't the price of innovation. Reward dispersion is — and that's a flow you can have without locking wealth into a hereditary few.
        </PullQuote>
      </Section>

      {/* CAVEATS */}
      <Section id="caveats" width="reading">
        <Reveal><SectionHeading eyebrow="The honest footnotes" title="What this model can — and can't — show" /></Reveal>
        <div className="prose-editorial mt-8 text-[1.05rem]" style={{ color: '#332e26' }}>
          <p>
            This is a rebuilt model. The original published here had three disqualifying bugs — innovation was pinned constant by a normalization error, the credit constraint stopped binding, and taxes were modeled as pure consumption transfer, which made "redistribution hurts" true by construction. The old six-regime table and the "growth peaks at wealth Gini 0.45–0.55" sweep are <strong>withdrawn</strong>. What's above is a stylized <em>mechanism map</em>, not evidence about real economies: it builds in credit constraints and a talent-exposure channel by assumption, and reports results only where the confidence intervals separate.
          </p>
          <p className="mt-4">
            Low inequality is necessary but <strong>not sufficient</strong> — Japan kept inequality low yet stagnated for unrelated reasons (a balance-sheet recession, demographics, zombie firms). Equality is a foundation, not a guarantee.
          </p>
        </div>
        <Callout label="Why we don't blame the Soviet Union">
          It's tempting to say "too much equality gives you the USSR." The research says otherwise. The Soviet Union failed from coercion and the absence of price signals — not from equality itself. The Nordic countries reach similar income-Gini levels <em>inside</em> functioning markets, with entry, exit and prices intact, and they thrive. The villain isn't equality; it's how you get there.
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
