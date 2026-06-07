import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine,
  AreaChart, Area,
} from 'recharts';
import ResearchLayout, { Section } from '../../../web/src/components/research/ResearchLayout';
import {
  Reveal, SectionHeading, StatCallout, PullQuote, KeyFinding, Figure, Callout,
} from '../../../web/src/components/research/primitives';
import { Slider, PresetButtons } from '../../../web/src/components/research/controls';
import { ResearchTooltip } from '../../../web/src/components/research/charts';
import reportRaw from '../data/report.md?raw';
import labData from '../data/policy_lab.json';

const PRETTY = {
  income_tax_rate: 'Income tax', capital_gains_rate: 'Capital-gains tax', corporate_tax_rate: 'Corporate tax',
  wealth_tax_rate: 'Wealth tax', healthcare_coverage: 'Healthcare coverage', unemployment_insurance: 'Unemployment insurance',
  education_funding: 'Education funding', immigration_openness: 'Immigration openness', labor_flexibility: 'Labor flexibility',
  worker_mobility: 'Worker mobility', unionization: 'Unionization', vc_availability: 'Venture capital',
  public_rd_investment: 'Public R&D', banking_regulation: 'Banking regulation', market_size: 'Market size',
  ip_protection: 'IP protection', regulatory_burden: 'Regulatory burden', startup_ease: 'Startup ease',
  reserve_currency: 'Reserve-currency status', initial_inequality: 'Starting inequality',
};

const SLIDER_LABEL = {
  banking_regulation: 'Banking regulation', market_size: 'Market size', income_tax_rate: 'Income-tax rate',
  healthcare_coverage: 'Healthcare coverage', education_funding: 'Education funding', vc_availability: 'Venture capital',
};

const SP = labData.sliderParams;

const LAB_PRESETS = {
  'US-like': { banking_regulation: 0.40, market_size: 0.90, income_tax_rate: 0.24, healthcare_coverage: 0.55, education_funding: 0.05, vc_availability: 0.85 },
  'Nordic-like': { banking_regulation: 0.60, market_size: 0.15, income_tax_rate: 0.45, healthcare_coverage: 0.95, education_funding: 0.07, vc_availability: 0.45 },
  'East-Asian': { banking_regulation: 0.55, market_size: 0.35, income_tax_rate: 0.30, healthcare_coverage: 0.90, education_funding: 0.06, vc_availability: 0.50 },
  'Optimal': { banking_regulation: 0.733, market_size: 0.70, income_tax_rate: 0.393, healthcare_coverage: 0.812, education_funding: 0.060, vc_availability: 0.523 },
};

const ACCENT = '#b4541f';
const STEEL = '#3a5a8c';

const RES_KEYS = ['composite_score', 'long_run_growth', 'avg_innovation', 'final_median_wealth', 'resilience', 'final_inequality', 'crisis_frequency'];

function knn(point, k = 12) {
  const scored = labData.configs.map((c) => {
    let d = 0;
    for (const p of SP) { const diff = c[p] - point[p]; d += diff * diff; }
    return { c, d };
  });
  scored.sort((a, b) => a.d - b.d);
  const top = scored.slice(0, k).map((s) => s.c);
  const avg = {};
  for (const key of RES_KEYS) avg[key] = top.reduce((s, c) => s + (c[key] ?? 0), 0) / top.length;
  return avg;
}

export default function InnovationLeversPage({ onBack }) {
  const [sliders, setSliders] = useState({ ...LAB_PRESETS['US-like'] });
  const [preset, setPreset] = useState('US-like');

  const result = useMemo(() => knn(sliders), [sliders]);

  const setS = (p, v) => { setSliders((s) => ({ ...s, [p]: v })); setPreset(null); };
  const applyPreset = (name) => { setSliders({ ...LAB_PRESETS[name] }); setPreset(name); };

  // 20-lever ranking data
  const rankData = labData.correlations.map((d) => ({ ...d, name: PRETTY[d.param] || d.param }));

  // histogram with marker
  const { lo, hi, bins } = labData.histogram;
  const binW = (hi - lo) / bins.length;
  const histData = bins.map((count, i) => ({ x: lo + (i + 0.5) * binW, count }));
  const markerX = result.composite_score;

  // preset comparison
  const P = labData.presets;
  const presetCompare = [
    { metric: 'Composite ×100', US: P['US-like'].composite_score * 100, Nordic: P['Nordic-like'].composite_score * 100, EastAsian: P['East Asian-like'].composite_score * 100 },
    { metric: 'Innovation (patents/yr)', US: P['US-like'].avg_innovation, Nordic: P['Nordic-like'].avg_innovation, EastAsian: P['East Asian-like'].avg_innovation },
    { metric: 'Median wealth ($k)', US: P['US-like'].final_median_wealth / 1000, Nordic: P['Nordic-like'].final_median_wealth / 1000, EastAsian: P['East Asian-like'].final_median_wealth / 1000 },
    { metric: 'Resilience ×100', US: P['US-like'].resilience * 100, Nordic: P['Nordic-like'].resilience * 100, EastAsian: P['East Asian-like'].resilience * 100 },
    { metric: 'Inequality ×100', US: P['US-like'].final_inequality * 100, Nordic: P['Nordic-like'].final_inequality * 100, EastAsian: P['East Asian-like'].final_inequality * 100 },
  ];

  return (
    <ResearchLayout
      theme="innovation"
      eyebrow="Growth & Innovation · 5,000 simulated economies"
      title="Banking rules beat venture capital"
      dek="We swept 20 institutional levers across 5,000 economic simulations. The forces that actually drive prosperity and innovation are market size and financial regulation — not the venture capital, IP law, or R&D subsidies that dominate the debate."
      heroMeta={[
        { value: '+0.49', label: 'market size — #1 lever' },
        { value: '+0.48', label: 'banking regulation — #2' },
        { value: '+0.01', label: 'venture capital — last' },
        { value: '5,000', label: 'configs × 50 years' },
      ]}
      sections={[
        { id: 'takeaways', label: 'Takeaways' },
        { id: 'ranking', label: 'The levers' },
        { id: 'lab', label: 'Policy lab' },
        { id: 'models', label: 'Three models' },
        { id: 'caveats', label: 'Caveats' },
      ]}
      reportText={reportRaw}
      exportTitle="What Actually Creates Prosperity and Innovation"
      exportFilename="innovation-levers-research"
      onBack={onBack}
    >
      {/* TAKEAWAYS */}
      <Section id="takeaways" width="wide">
        <Reveal><SectionHeading eyebrow="The takeaways" title="The levers that matter aren't the ones we argue about" dek="Run five thousand economies for fifty years each, and the same boring fundamentals keep deciding who prospers." /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <KeyFinding index={1} title="The biggest lever is boring: banking regulation.">
            The strongest <em>controllable</em> driver of outcomes (r = +0.48). It works by preventing financial crises — a single crisis erases 5–10 years of growth. The sweet spot is moderate-to-firm regulation (0.60–0.79), not deregulation.
          </KeyFinding>
          <KeyFinding index={2} title="Market size dwarfs venture capital." delay={120}>
            Market size is the single strongest correlate (r = +0.49); venture capital is statistically insignificant (r = +0.01), alongside IP protection, public R&D and unionization. The hot-button policies barely move the needle.
          </KeyFinding>
          <KeyFinding index={3} title="Taxes correlate positively; reserve currency negatively." delay={240}>
            Higher income, wealth and capital-gains taxes track <em>better</em> outcomes — they fund the public goods that build human capital. Meanwhile reserve-currency "exorbitant privilege" is a mild curse (r = −0.05): cheap capital fuels bubbles and dulls reform.
          </KeyFinding>
        </div>
      </Section>

      {/* RANKING */}
      <Section id="ranking" width="wide">
        <Reveal><SectionHeading eyebrow="Twenty levers, ranked" title="What correlates with prosperity + innovation" dek="Spearman correlation of each lever with the composite score across 5,000 Latin-Hypercube configurations. The top six are all foundational institutional quality — not market-versus-state ideology." /></Reveal>
        <Reveal delay={80}>
          <Figure className="mt-10" caption="Positive bars = more of the lever tracks better outcomes; the few negative bars (starting inequality, regulatory burden, reserve currency) are 'less-is-better' levers. Venture capital, IP protection, public R&D and unionization all sit on the zero line." source="5,000 configurations × 3 seeds · 50-year runs">
            <div style={{ height: 640 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankData} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
                  <XAxis type="number" domain={[-0.2, 0.55]} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 10.5, fill: '#3a342c' }} stroke="rgba(33,29,24,0.2)" />
                  <ReferenceLine x={0} stroke="rgba(33,29,24,0.4)" />
                  <Tooltip cursor={{ fill: 'rgba(33,29,24,0.05)' }} content={<ResearchTooltip formatter={(v) => `r = ${(+v).toFixed(3)}`} labelFormatter={(l) => l} />} />
                  <Bar dataKey="r" radius={[0, 3, 3, 0]} isAnimationActive animationDuration={800}>
                    {rankData.map((d) => (
                      <Cell key={d.param} fill={d.r >= 0 ? ACCENT : STEEL} opacity={['market_size', 'banking_regulation', 'vc_availability'].includes(d.param) ? 1 : 0.62} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Figure>
        </Reveal>
      </Section>

      {/* POLICY LAB */}
      <Section id="lab" width="wide">
        <Reveal><SectionHeading eyebrow="Run your own economy" title="The policy lab" dek="Set the six biggest levers and see where similar simulated economies actually landed." /></Reveal>
        <Reveal delay={80}>
          <Figure className="mt-10" caption="Outcomes are the average of the dozen simulated economies whose settings sit closest to yours, out of 5,000 runs.">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>Real-world recipes</div>
                <div className="mt-2"><PresetButtons options={Object.keys(LAB_PRESETS).map((k) => ({ value: k, label: k }))} value={preset} onChange={applyPreset} /></div>
                <div className="mt-6 space-y-4">
                  {SP.map((p) => (
                    <Slider key={p} label={SLIDER_LABEL[p]} value={sliders[p]} min={0} max={1} step={0.01} onChange={(v) => setS(p, v)} format={(v) => v.toFixed(2)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Composite prosperity + innovation score</div>
                    <div className="font-display text-[4rem] font-semibold leading-none" style={{ color: 'var(--accent)' }}>{(result.composite_score * 100).toFixed(0)}</div>
                    <div className="font-mono text-[11px]" style={{ color: 'var(--muted)' }}>out of 100 · range across all runs: {(lo * 100).toFixed(0)}–{(hi * 100).toFixed(0)}</div>
                  </div>
                  <div style={{ width: 220, height: 78 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={histData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                        <Area type="monotone" dataKey="count" stroke={ACCENT} fill={ACCENT} fillOpacity={0.18} strokeWidth={1.5} isAnimationActive={false} />
                        <ReferenceLine x={markerX} stroke="#211d18" strokeWidth={2} />
                        <XAxis dataKey="x" hide domain={[lo, hi]} type="number" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="text-center font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>your economy vs all 5,000</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                  <Stat label="Long-run growth" value={(result.long_run_growth * 100).toFixed(2)} suffix=" %/yr" />
                  <Stat label="Innovation" value={result.avg_innovation.toFixed(0)} suffix=" pat/yr" />
                  <Stat label="Median wealth" value={`$${(result.final_median_wealth / 1000).toFixed(0)}k`} />
                  <Stat label="Resilience" value={(result.resilience * 100).toFixed(0)} suffix="/100" />
                  <Stat label="Inequality" value={result.final_inequality.toFixed(2)} tone="neg" />
                  <Stat label="Crises / 50yr" value={(result.crisis_frequency * 50).toFixed(1)} tone="neg" />
                </div>
              </div>
            </div>
          </Figure>
        </Reveal>
      </Section>

      {/* THREE MODELS */}
      <Section id="models" width="wide">
        <Reveal><SectionHeading eyebrow="Three real-world recipes" title="Most innovation ≠ most prosperity" dek="Thirty-seed runs of the U.S., Nordic and East-Asian configurations. The U.S. wins one column and loses the rest." /></Reveal>
        <Reveal delay={80}>
          <Figure className="mt-10" caption="Higher is better for every bar except inequality.">
            <div style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={presetCompare} margin={{ left: 0, right: 8, top: 8, bottom: 4 }}>
                  <XAxis dataKey="metric" tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 10, fill: '#3a342c' }} stroke="rgba(33,29,24,0.2)" interval={0} />
                  <YAxis tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" />
                  <Tooltip cursor={{ fill: 'rgba(33,29,24,0.05)' }} content={<ResearchTooltip formatter={(v, n) => `${n}: ${(+v).toFixed(1)}`} />} />
                  <Bar dataKey="US" name="US-like" fill="#9b2d2d" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Nordic" name="Nordic-like" fill="#1f5a43" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="EastAsian" name="East-Asian" fill={ACCENT} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {[['US-like', '#9b2d2d'], ['Nordic-like', '#1f5a43'], ['East-Asian', ACCENT]].map(([n, c]) => (
                <span key={n} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: c }} />{n}
                </span>
              ))}
            </div>
          </Figure>
        </Reveal>
        <PullQuote cite="The innovation paradox">
          The U.S. recipe makes the most raw innovation — about 223 patents a year versus the Nordic 100 — but the least broadly-shared prosperity. Over fifty years its inequality feeds back to choke the very innovation engine that produced it.
        </PullQuote>
      </Section>

      {/* CAVEATS */}
      <Section id="caveats" width="reading">
        <Reveal><SectionHeading eyebrow="Read the fine print" title="A model, not reality" /></Reveal>
        <div className="prose-editorial mt-8 text-[1.05rem]" style={{ color: '#332e26' }}>
          <p>
            This is a systems-dynamics model that captures roughly thirty relationships. It treats the twenty levers as independent (real economies don't), holds market size fixed (which probably overstates it), and assumes the relationships stay stable for fifty years. The composite score bakes in a value judgment — 20% growth, 20% innovation, 25% median wealth, 15% resilience, 10% sustainability, 10% GDP level. Change those weights and the "optimal" economy shifts.
          </p>
        </div>
        <Callout label="Why trust the direction, if not the decimals">
          This isn't a left- or right-wing result. It's where the IMF, the OECD and decades of development economics have independently converged: foundational institutional quality — financial stability, health, education, and limits on extreme inequality — beats any single market intervention. The model re-derived it from scratch.
        </Callout>
      </Section>
    </ResearchLayout>
  );
}

function Stat({ label, value, suffix = '', tone = 'accent' }) {
  const color = tone === 'neg' ? 'var(--neg)' : 'var(--accent)';
  return (
    <div className="border-t pt-3" style={{ borderColor: 'var(--rule)' }}>
      <div className="font-display text-[1.7rem] font-semibold leading-none" style={{ color }}>
        {value}<span className="font-mono text-[0.7rem]" style={{ color: 'var(--muted)' }}>{suffix}</span>
      </div>
      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}
