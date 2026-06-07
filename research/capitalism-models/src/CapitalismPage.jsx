import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine,
} from 'recharts';
import ResearchLayout, { Section } from '../../../web/src/components/research/ResearchLayout';
import {
  Reveal, SectionHeading, StatCallout, PullQuote, KeyFinding, Figure, Callout,
} from '../../../web/src/components/research/primitives';
import { Slider, PresetButtons } from '../../../web/src/components/research/controls';
import { ResearchTooltip } from '../../../web/src/components/research/charts';
import reportRaw from '../data/report.md?raw';

/* ----------------------------- data ----------------------------- */
const MODEL_OF = {
  US: 'Anglo-American', UK: 'Anglo-American',
  Sweden: 'Nordic', Denmark: 'Nordic', Finland: 'Nordic',
  Germany: 'Rhine/Germanic', Netherlands: 'Rhine/Germanic', Switzerland: 'Rhine/Germanic',
  Japan: 'East Asian Dev.', 'South Korea': 'East Asian Dev.', Singapore: 'East Asian Dev.',
  China: 'Chinese State Cap.',
};
const FULL_NAME = {
  US: 'United States', UK: 'United Kingdom', Sweden: 'Sweden', Denmark: 'Denmark',
  Finland: 'Finland', Germany: 'Germany', Netherlands: 'Netherlands', Switzerland: 'Switzerland',
  Japan: 'Japan', 'South Korea': 'South Korea', Singapore: 'Singapore', China: 'China',
};
const COUNTRIES = Object.keys(MODEL_OF);

const METRICS = [
  'gdp_growth', 'inequality', 'social_mobility', 'innovation',
  'quality_of_life', 'resilience', 'sustainability',
];
const METRIC_LABEL = {
  gdp_growth: 'GDP growth', inequality: 'Equality (low Gini)', social_mobility: 'Social mobility',
  innovation: 'Innovation', quality_of_life: 'Quality of life', resilience: 'Resilience',
  sustainability: 'Sustainability',
};
const INVERT = new Set(['inequality', 'social_mobility']);

const RAW = {
  gdp_growth: { US: 1.6, UK: 1.1, Sweden: 1.3, Denmark: 1.5, Finland: 0.8, Germany: 0.9, Netherlands: 1.3, Switzerland: 1.1, Japan: 0.7, 'South Korea': 2.1, Singapore: 2.5, China: 5.2 },
  inequality: { US: 39, UK: 35, Sweden: 28, Denmark: 27, Finland: 27, Germany: 31, Netherlands: 29, Switzerland: 32, Japan: 33, 'South Korea': 32, Singapore: 39.8, China: 38.5 },
  social_mobility: { US: 0.47, UK: 0.50, Sweden: 0.27, Denmark: 0.15, Finland: 0.18, Germany: 0.32, Netherlands: 0.26, Switzerland: 0.46, Japan: 0.34, 'South Korea': 0.39, Singapore: 0.32, China: 0.60 },
  innovation: { US: 62.4, UK: 60.3, Sweden: 64.5, Denmark: 58.8, Finland: 57.6, Germany: 56.5, Netherlands: 61.2, Switzerland: 67.5, Japan: 53.3, 'South Korea': 56.5, Singapore: 62.7, China: 50.3 },
  quality_of_life: { US: 82, UK: 81, Sweden: 87, Denmark: 89, Finland: 89, Germany: 83, Netherlands: 86, Switzerland: 88, Japan: 79, 'South Korea': 76, Singapore: 82, China: 60 },
  resilience: { US: 55, UK: 50, Sweden: 72, Denmark: 70, Finland: 63, Germany: 65, Netherlands: 62, Switzerland: 75, Japan: 42, 'South Korea': 58, Singapore: 73, China: 62 },
  sustainability: { US: 25, UK: 45, Sweden: 78, Denmark: 70, Finland: 63, Germany: 50, Netherlands: 42, Switzerland: 63, Japan: 30, 'South Korea': 25, Singapore: 22, China: 32 },
};

const MODEL_COLOR = {
  Nordic: '#1f5a43',
  'Anglo-American': '#9b2d2d',
  'Rhine/Germanic': '#2f5d8c',
  'East Asian Dev.': '#b4541f',
  'Chinese State Cap.': '#6f655a',
};

const PRESETS = {
  Equal: { gdp_growth: 1, inequality: 1, social_mobility: 1, innovation: 1, quality_of_life: 1, resilience: 1, sustainability: 1 },
  'Growth-heavy': { gdp_growth: 2, inequality: 1, social_mobility: 1, innovation: 2, quality_of_life: 1, resilience: 1, sustainability: 1 },
  'Equity-heavy': { gdp_growth: 1, inequality: 2, social_mobility: 2, innovation: 1, quality_of_life: 1, resilience: 1, sustainability: 1 },
  'Sustainability': { gdp_growth: 1, inequality: 1, social_mobility: 1, innovation: 1, quality_of_life: 1, resilience: 1, sustainability: 3 },
  'Human dev.': { gdp_growth: 0.5, inequality: 1.5, social_mobility: 1.5, innovation: 1, quality_of_life: 2, resilience: 1, sustainability: 1.5 },
  'Pure GDP': { gdp_growth: 1, inequality: 0, social_mobility: 0, innovation: 0, quality_of_life: 0, resilience: 0, sustainability: 0 },
};

// Pre-normalize each metric across the 12 countries (0–100, inverted where needed).
const NORM = (() => {
  const out = {};
  for (const m of METRICS) {
    const vals = COUNTRIES.map((c) => RAW[m][c]);
    const min = Math.min(...vals), max = Math.max(...vals);
    out[m] = {};
    for (const c of COUNTRIES) {
      const v = RAW[m][c];
      out[m][c] = max === min ? 50 : INVERT.has(m) ? (100 * (max - v)) / (max - min) : (100 * (v - min)) / (max - min);
    }
  }
  return out;
})();

function scoreAll(weights) {
  const total = METRICS.reduce((s, m) => s + weights[m], 0) || 1;
  return COUNTRIES.map((c) => {
    const score = METRICS.reduce((s, m) => s + (weights[m] * NORM[m][c]) / total, 0);
    return { code: c, name: FULL_NAME[c], model: MODEL_OF[c], score };
  });
}

const MC_FIRST = [
  { model: 'Nordic', pct: 96.1 },
  { model: 'Chinese State Cap.', pct: 3.6 },
  { model: 'Rhine/Germanic', pct: 0.2 },
  { model: 'East Asian Dev.', pct: 0.0 },
  { model: 'Anglo-American', pct: 0.0 },
];

const SCHEME_ROWS = [
  { scheme: 'Equal weighting', nordic: 74.2, anglo: 36.5 },
  { scheme: 'Growth-heavy', nordic: 65.4, anglo: 37.1 },
  { scheme: 'Equity-heavy', nordic: 78.4, anglo: 33.6 },
  { scheme: 'Human development', nordic: 83.1, anglo: 39.7 },
  { scheme: 'Pure GDP', nordic: 11.1, anglo: 14.4 },
];

/* ----------------------------- page ----------------------------- */
export default function CapitalismPage({ onBack }) {
  const [weights, setWeights] = useState({ ...PRESETS.Equal });
  const [preset, setPreset] = useState('Equal');

  const ranked = useMemo(
    () => scoreAll(weights).sort((a, b) => b.score - a.score),
    [weights]
  );
  const usRank = ranked.findIndex((r) => r.code === 'US') + 1;
  const topCountry = ranked[0];
  const modelAvg = (model) => {
    const xs = ranked.filter((r) => r.model === model);
    return xs.reduce((s, r) => s + r.score, 0) / (xs.length || 1);
  };
  const nordicAvg = modelAvg('Nordic');
  const angloAvg = modelAvg('Anglo-American');

  const setW = (m, v) => { setWeights((w) => ({ ...w, [m]: v })); setPreset(null); };
  const applyPreset = (name) => { setWeights({ ...PRESETS[name] }); setPreset(name); };

  return (
    <ResearchLayout
      theme="capitalism"
      eyebrow="Comparative Capitalism · 12 economies, 7 measures"
      title="The U.S. isn't the best at capitalism"
      dek="Rank twelve rich economies on growth, equality, mobility, innovation, quality of life, resilience and sustainability — and the Nordic model wins under almost any reasonable weighting. The United States lands near the bottom."
      heroMeta={[
        { value: '#10 / 12', label: 'U.S. rank, equal weighting' },
        { value: '96.1%', label: 'of 10,000 weightings put Nordics #1' },
        { value: '74 vs 37', label: 'Nordic vs Anglo-American avg' },
        { value: '0', label: 'times Anglo-American ranked first' },
      ]}
      sections={[
        { id: 'verdict', label: 'Verdict' },
        { id: 'scoreboard', label: 'Scoreboard' },
        { id: 'robust', label: 'Robustness' },
        { id: 'caveats', label: 'Caveats' },
      ]}
      reportText={reportRaw}
      exportTitle="Comparative Capitalism Models"
      exportFilename="capitalism-models-research"
      onBack={onBack}
    >
      {/* VERDICT */}
      <Section id="verdict" width="wide">
        <Reveal><SectionHeading eyebrow="The verdict" title="A scoreboard the U.S. keeps losing" dek="Twelve economies, seven outcomes that most people say they care about, normalized to a level playing field. Here is what falls out." /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <KeyFinding index={1} title="Nordic models win, and it isn't close.">
            Sweden (77.9), Denmark (76.8) and Finland (67.8) take the top three on equal weighting. The U.S. scores <strong>35.2</strong> — tenth of twelve, below South Korea and barely above Japan and China.
          </KeyFinding>
          <KeyFinding index={2} title="The result survives the weightings." delay={120}>
            Across 10,000 random weight combinations over all seven measures, a Nordic country ranked #1 in <strong>96.1%</strong> of them. Anglo-American economies ranked first exactly zero times. Only scoring on GDP growth <em>alone</em> flips it — and then China wins.
          </KeyFinding>
          <KeyFinding index={3} title="A scoreboard, not a prescription." delay={240}>
            Deep factors — trust, country size, history — shape both institutions and outcomes, so copying Nordic policy wouldn't automatically yield Nordic results. The honest claim is descriptive: by a broad basket of outcomes, the U.S. model is not the top performer.
          </KeyFinding>
        </div>
      </Section>

      {/* SCOREBOARD — interactive */}
      <Section id="scoreboard" width="wide">
        <Reveal><SectionHeading eyebrow="Score it yourself" title="Move the weights. Watch the ranking." dek="Decide how much each outcome matters to you. The composite re-scores and re-sorts live. The one thing you can't do is build a weighting that puts the United States on top." /></Reveal>

        <Reveal delay={80}>
          <Figure
            className="mt-10"
            caption="Each metric is min–max normalized to 0–100 across the twelve countries, then weighted and averaged."
            source="OECD · World Bank · WIPO GII · UN HDI · World Happiness Report"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
              {/* controls */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>Preset priorities</div>
                <div className="mt-2">
                  <PresetButtons
                    options={Object.keys(PRESETS).map((k) => ({ value: k, label: k }))}
                    value={preset}
                    onChange={applyPreset}
                  />
                </div>
                <div className="mt-6 space-y-4">
                  {METRICS.map((m) => (
                    <Slider
                      key={m}
                      label={METRIC_LABEL[m]}
                      value={weights[m]}
                      min={0}
                      max={3}
                      step={0.5}
                      onChange={(v) => setW(m, v)}
                      format={(v) => `×${v.toFixed(1)}`}
                    />
                  ))}
                </div>
              </div>

              {/* chart + readouts */}
              <div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                  <Readout label="U.S. rank" value={`#${usRank}`} tone={usRank > 6 ? 'neg' : 'accent'} />
                  <Readout label="Tops the table" value={topCountry.name} small />
                  <Readout label="Nordic avg" value={nordicAvg.toFixed(0)} />
                  <Readout label="Anglo-Amer. avg" value={angloAvg.toFixed(0)} tone="neg" />
                </div>

                <div className="mt-6" style={{ height: 480 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ranked} layout="vertical" margin={{ left: 8, right: 28, top: 4, bottom: 4 }}>
                      <XAxis type="number" domain={[0, 100]} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#6f655a' }} stroke="rgba(33,29,24,0.2)" />
                      <YAxis type="category" dataKey="name" width={104} tick={{ fontFamily: 'Spline Sans Mono, monospace', fontSize: 11, fill: '#3a342c' }} stroke="rgba(33,29,24,0.2)" />
                      <Tooltip cursor={{ fill: 'rgba(33,29,24,0.05)' }} content={<ResearchTooltip formatter={(v, n, p) => `${p.payload.model}: ${(+v).toFixed(1)}`} labelFormatter={() => 'Composite score'} />} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={650}>
                        {ranked.map((r) => (
                          <Cell
                            key={r.code}
                            fill={MODEL_COLOR[r.model]}
                            stroke={r.code === 'US' ? '#211d18' : 'none'}
                            strokeWidth={r.code === 'US' ? 2 : 0}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* legend */}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {Object.entries(MODEL_COLOR).map(([m, c]) => (
                    <span key={m} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: c }} />{m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Figure>
        </Reveal>
      </Section>

      {/* ROBUSTNESS */}
      <Section id="robust" width="mid">
        <Reveal><SectionHeading eyebrow="How robust is it?" title="It isn't an artefact of the weighting" dek="The obvious objection — 'you just picked weights that favour the Nordics' — is the first thing the analysis stress-tests." /></Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-lg border bg-[var(--paper-card)] p-6" style={{ borderColor: 'var(--rule)' }}>
              <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Ranked #1 across 10,000 random weightings</div>
              <div className="mt-4 space-y-3">
                {MC_FIRST.map((r) => (
                  <div key={r.model}>
                    <div className="flex items-baseline justify-between text-[13px]">
                      <span style={{ fontFamily: 'Newsreader, serif' }}>{r.model}</span>
                      <span className="font-mono font-semibold" style={{ color: r.pct > 50 ? 'var(--accent)' : 'var(--muted)' }}>{r.pct.toFixed(1)}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full" style={{ background: 'rgba(33,29,24,0.08)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${r.pct}%`, background: MODEL_COLOR[r.model] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-lg border bg-[var(--paper-card)] p-6" style={{ borderColor: 'var(--rule)' }}>
              <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Nordic vs Anglo-American avg by scheme</div>
              <div className="mt-4 space-y-2.5">
                {SCHEME_ROWS.map((r) => (
                  <div key={r.scheme} className="flex items-center gap-3 text-[13px]">
                    <span className="w-36 shrink-0" style={{ fontFamily: 'Newsreader, serif' }}>{r.scheme}</span>
                    <span className="font-mono font-semibold" style={{ color: '#1f5a43' }}>{r.nordic.toFixed(1)}</span>
                    <span className="font-mono" style={{ color: 'var(--muted)' }}>vs</span>
                    <span className="font-mono font-semibold" style={{ color: '#9b2d2d' }}>{r.anglo.toFixed(1)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[0.9rem]" style={{ color: 'var(--muted)' }}>
                The Nordic lead holds everywhere except <strong>Pure GDP</strong> — and on growth alone the real winner is China (100.0), not the U.S.
              </p>
            </div>
          </Reveal>
        </div>

        <PullQuote cite="Bootstrap confidence intervals, equal weights">
          Even after resampling every data point within its uncertainty range, the Nordic 90% interval (68.8–75.7) and the Anglo-American interval (32.0–41.8) never touch.
        </PullQuote>

        <Callout label="One honest wobble">
          The East Asian model's middling score leans on a single outlier: remove Singapore and its average drops <strong>5.8 points</strong>. The Nordic result has no such dependency.
        </Callout>
      </Section>

      {/* CAVEATS */}
      <Section id="caveats" width="reading">
        <Reveal><SectionHeading eyebrow="What this is — and isn't" title="Descriptive, not destiny" /></Reveal>
        <div className="prose-editorial mt-8 text-[1.05rem]" style={{ color: '#332e26' }}>
          <p>
            This is a scorecard, not a causal proof. With five model types spread across twelve countries, there is no clean way to show that the <em>model</em> causes the outcome. Deep factors — social trust, ethnic homogeneity, geography, history — plausibly shape both which model a country adopts and how well it does. Putnam's Italy and the endogeneity literature are the reason this analysis refuses to claim "adopt Nordic policy, get Nordic results."
          </p>
          <p>
            It's also worth remembering why the U.S. looked unbeatable for a generation. In 1945 it held more than half of the world's manufacturing capacity and the global reserve currency — structural advantages, not evidence that lighter-touch capitalism is superior. And the U.S. was never actually laissez-faire: the internet, GPS, and the modern pharma pipeline all trace back to heavy government R&D.
          </p>
        </div>
        <Callout label="The defensible claim">
          By a broad, transparent basket of outcomes — and across thousands of ways of weighting them — the American model is not the best-performing form of capitalism. That's a statement about the scoreboard, not a policy mandate.
        </Callout>
      </Section>
    </ResearchLayout>
  );
}

function Readout({ label, value, tone = 'accent', small = false }) {
  const color = tone === 'neg' ? 'var(--neg)' : 'var(--accent)';
  return (
    <div className="border-t pt-3" style={{ borderColor: 'var(--rule)' }}>
      <div className={`font-display font-semibold leading-none ${small ? 'text-[1.25rem]' : 'text-[2rem]'}`} style={{ color }}>{value}</div>
      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}
